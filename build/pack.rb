begin
  require 'rubygems'
  require 'nokogiri'
  require 'uglifier'
  require 'fileutils'
rescue LoadError
  puts
  puts "Oops! Some gems are missing; please run:"
  puts "  sudo gem install nokogiri uglifier"
  puts
  exit 1
end

# All paths are relative to khan-exercises/ root
Dir.chdir(File.join(File.dirname(__FILE__), ".."))

# Discard all comments
@uglifier = Uglifier.new(:copyright => false)

FileUtils.mkdir_p("exercises-packed")

Dir["exercises/*.html"].each do |filename|
  packed_filename = filename.gsub(/^exercises\//, "exercises-packed/")
  next if File.exist?(packed_filename) && File.mtime(packed_filename) > File.mtime(filename)

  puts filename
  cant = 0
  doc = Nokogiri::HTML::Document.parse(File.read(filename))

  doc.css("var").each do |var|
    if var.elements.any?
      puts "-- error: JS element has children"
      puts var.inner_html
      exit 1
    end

    next if var.content !~ /\S/ # only whitespace

    exp = "(#{var.content})"
    var.content = @uglifier.compile(exp)
  end

  doc.css(".graphie").each do |graphie|
    if graphie.elements.any?
      puts "-- error: JS element has children"
      exit 1
    end

    js = graphie.content
    graphie.content = @uglifier.compile(js)
  end

  File.open(packed_filename, "w") do |f|
    f.write doc.to_html
  end
end
