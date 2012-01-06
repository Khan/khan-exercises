begin
  require 'rubygems'
  require 'nokogiri'
  require 'uglifier'
  require 'fileutils'
rescue LoadError
  puts
  puts "-" * 78
  puts "Oops! Some gems are missing; please run:"
  puts "  sudo gem install nokogiri uglifier therubyracer"
  puts
  puts "If you prefer another JS runtime (https://github.com/sstephenson/execjs),"
  puts "be aware that this script is much faster (around 50x speedup) using"
  puts "therubyracer, which is based on Chrome's V8 engine."
  puts "-" * 78
  puts
  exit 1
end

begin
  require 'v8'
rescue LoadError
  puts
  puts "-" * 78
  puts "Warning! You don't have therubyracer installed, packing might be slow. Try:"
  puts "  sudo gem install therubyracer"
  puts "-" * 78
  puts
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

  doc.css(".graphie", "div.guess", "div.show-guess", "div.show-guess-solutionarea").each do |graphie|
    if graphie.elements.any?
      puts "-- error: JS element has children"
      exit 1
    end

    js = graphie.content
    graphie.content = @uglifier.compile(js)
  end

  doc.css("div.validator-function").each do |validator|
    if validator.elements.any?
      puts "-- error: JS element has children"
      exit 1
    end

    # need to wrap validator-function content in a function, so uglifier
    # doesn't get confused by the estranged 'return' statement
    js = "(function(){" + validator.content + "})()"
    uglified = @uglifier.compile(js)
    # strip out the anonymous function wrapper to put things back the way they were
    validator.content = uglified[ /^\(function\(\)\{(.*)\}\)\(\)$/, 1 ]
  end

  %w[data-ensure data-if data-else-if].each do |data_attr|
    doc.css("[#{data_attr}]").each do |el|
      js = el[data_attr]
      el[data_attr] = @uglifier.compile(js)
    end
  end

  File.open(packed_filename, "w") do |f|
    f.write doc.to_html
  end
end
