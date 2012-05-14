begin
  require 'rubygems'
  require 'nokogiri'
  require 'execjs'
  require 'uglifier'
  require 'fileutils'
rescue LoadError
  puts
  puts "-" * 78
  puts "Oops! Some gems are missing; please run:"
  puts "  sudo gem install json nokogiri uglifier therubyracer"
  puts "-" * 78
  puts
  exit 1
end

begin
  require 'json'
rescue LoadError
  puts
  puts "-" * 78
  puts "Warning! You don't have json installed, packing might be slow. Try:"
  puts "  sudo gem install json"
  puts
  puts "You can also use another json library.  If you don't do anything,"
  puts "this script will use the default, ok_json, which is ok, but slow."
  puts "-" * 78
  puts
end

begin
  require 'v8'
rescue LoadError
  puts
  puts "-" * 78
  puts "Warning! You don't have therubyracer installed, packing might be slow. Try:"
  puts "  sudo gem install therubyracer"
  puts
  puts "If you prefer another JS runtime (https://github.com/sstephenson/execjs),"
  puts "be aware that this script is much faster (around 50x speedup) using"
  puts "therubyracer, which is based on Chrome's V8 engine."
  puts "-" * 78
  puts
end

JSHINT_ENABLED = false
JSHINT_OPTIONS = {
  :laxbreak => true,
  :eqeqeq => true,
  :loopfunc => true,
}

def jshint(js)
  return unless JSHINT_ENABLED
  if !@jshint.call("JSHINT", js, JSHINT_OPTIONS)
    @jshint.eval("JSHINT.errors").each do |err|
      break if err["reason"] == "Expected ')' to match '(' from line 1 and instead saw ','."
      # puts "-- #{js}"
      puts "-- #{err["reason"]} (#{err["line"]}:#{err["character"]})"
      puts "-- > #{(err["evidence"] || "").strip}"
      puts "--"
    end
  end
end

# All paths are relative to khan-exercises/ root
Dir.chdir(File.join(File.dirname(__FILE__), ".."))

@uglifier = Uglifier.new(:copyright => false)  # Discard all comments
@jshint = ExecJS.compile(File.read("build/jshint.js"))

def uglifier_insane
  puts
  puts "-" * 78
  puts "Error! The uglifier gem is doing weird things that we don't expect."
  puts "Stopping now so that the children can keep learning."
  puts "-" * 78
  puts
  exit 1
end

# uglifier sanity check
[
  ["(A + B)", ["A+B", "A+B;"]],
  ["(function() { return 5; })", ["(function(){return 5})", "(function(){return 5});"]],
].each do |input, expected|
  output = @uglifier.compile(input)
  uglifier_insane unless expected.include? output
end

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

    jshint("return (#{var.content});")
    exp = "(#{var.content})"
    var.content = @uglifier.compile(exp).gsub(/;$/, "")
  end

  doc.css(".graphie", "div.guess", "div.show-guess", "div.show-guess-solutionarea").each do |graphie|
    if graphie.elements.any?
      puts "-- error: JS element has children"
      exit 1
    end

    js = graphie.content
    graphie.content = @uglifier.compile(js).gsub(/;$/, "")
  end

  doc.css("div.validator-function").each do |validator|
    if validator.elements.any?
      puts "-- error: JS element has children"
      exit 1
    end

    # Need to wrap validator-function content in a function, so uglifier
    # doesn't get confused by the estranged 'return' statement
    js = "(function(){" + validator.content + "})()"
    uglified = @uglifier.compile(js)

    # Strip out the anonymous function wrapper to put things back the way they were
    match = uglified.match(/^\(function\(\)\{(.*)\}\)\(\);?$/)
    if match
      validator.content = match[1]
    else
      uglifier_insane
    end
  end

  %w[data-ensure data-if data-else-if].each do |data_attr|
    doc.css("[#{data_attr}]").each do |el|
      jshint("return (#{el[data_attr]});")
      js = el[data_attr]
      el[data_attr] = @uglifier.compile(js).gsub(/;$/, "")
    end
  end

  File.open(packed_filename, "w") do |f|
    f.write doc.to_html
  end
end
