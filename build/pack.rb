# Packs exercise files.  Usage modes:
#   1) Pass a single filename on the commandline.  Output is written
#      to stdout.
#   2) Pass the contents of a single file via stdin.  Output is
#      written to stdout.
#   3) Pass multiple filenames on the commandline.  Output is written
#      to stdout, all concatenated together.  (You can divide them up
#      since each document will end with '</html>').
#   4) Pass the contents of multiple files, concatenated together, via
#      stdin.  Output is written to stdout, all concatenated together.
#      (You can divide them up since each document will end with
#      '</html>').  To work correctly, this depends on the fact all
#      documents start with a '<!DOCTYPE' line.

begin
  require 'rubygems'
  require 'nokogiri'
  require 'execjs'
  require 'uglifier'
  require 'fileutils'
rescue LoadError
  $stderr.puts
  $stderr.puts "-" * 78
  $stderr.puts "Oops! Some gems are missing; please run:"
  $stderr.puts "  sudo gem install json nokogiri uglifier therubyracer"
  $stderr.puts "-" * 78
  $stderr.puts
  exit 1
end

begin
  require 'json'
rescue LoadError
  $stderr.puts
  $stderr.puts "-" * 78
  $stderr.puts "Warning! You don't have json installed, packing might be slow. Try:"
  $stderr.puts "  sudo gem install json"
  $stderr.puts
  $stderr.puts "You can also use another json library.  If you don't do anything,"
  $stderr.puts "this script will use the default, ok_json, which is ok, but slow."
  $stderr.puts "-" * 78
  $stderr.puts
end

begin
  require 'v8'
rescue LoadError
  $stderr.puts
  $stderr.puts "-" * 78
  $stderr.puts "Warning! You don't have therubyracer installed, packing might be slow. Try:"
  $stderr.puts "  sudo gem install therubyracer"
  $stderr.puts
  $stderr.puts "If you prefer another JS runtime (https://github.com/sstephenson/execjs),"
  $stderr.puts "be aware that this script is much faster (around 50x speedup) using"
  $stderr.puts "therubyracer, which is based on Chrome's V8 engine."
  $stderr.puts "-" * 78
  $stderr.puts
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
      # $stderr.puts "-- #{js}"
      $stderr.puts "-- #{err["reason"]} (#{err["line"]}:#{err["character"]})"
      $stderr.puts "-- > #{(err["evidence"] || "").strip}"
      $stderr.puts "--"
    end
  end
end

# All paths are relative to khan-exercises/ root
Dir.chdir(File.join(File.dirname(__FILE__), ".."))

@uglifier = Uglifier.new(:copyright => false)  # Discard all comments
@jshint = ExecJS.compile(File.read("build/jshint.js"))

def uglifier_insane
  $stderr.puts
  $stderr.puts "-" * 78
  $stderr.puts "Error! The uglifier gem is doing weird things that we don't expect."
  $stderr.puts "Stopping now so that the children can keep learning."
  $stderr.puts "-" * 78
  $stderr.puts
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

def pack_file(file_contents)
  # Can specify a filename either on the commandline or piped into stdin
  doc = Nokogiri::HTML::Document.parse(file_contents)

  doc.css("var").each do |var|
    if var.elements.any?
      $stderr.puts "-- error: JS element has children"
      $stderr.puts var.inner_html
      exit 1
    end

    next if var.content !~ /\S/ # only whitespace

    jshint("return (#{var.content});")
    exp = "(#{var.content})"
    var.content = @uglifier.compile(exp).gsub(/;$/, "")
  end

  doc.css(".graphie", "div.guess", "div.show-guess", "div.show-guess-solutionarea").each do |graphie|
    if graphie.elements.any?
      $stderr.puts "-- error: JS element has children"
      exit 1
    end

    js = graphie.content
    graphie.content = @uglifier.compile(js).gsub(/;$/, "")
  end

  doc.css("div.validator-function").each do |validator|
    if validator.elements.any?
      $stderr.puts "-- error: JS element has children"
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

  # Done!
  return doc.to_html
end

current_file_contents = []
ARGF.lines do |line|
  if (ARGF.to_io.lineno == 1 or              # starting a new file: argv mode
      (ARGF.filename == '-' and line.match(/^<!DOCTYPE/)))    # or stdin mode
    unless current_file_contents.empty?
      puts pack_file(current_file_contents.join(''))
      current_file_contents = []
    end
  end
  current_file_contents << line
end

# Put the last file as well.
puts pack_file(current_file_contents.join('')) unless current_file_contents.empty?

# ruby wants to do some expensive cleanup we don't care about.  Short-circuit.
$stdout.flush
exit! 0
