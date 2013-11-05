# Packs javascript in exercise files, and does some sanity-checking.
#
# The sanity-checking is to make sure that the javascript nodes are
# well-formed: they don't have html children, etc.
#
# The packing is to make sure the javascript nodes are well behaved.
# The problem is that we put javascript into nodes that expect to
# have html: some <div>'s, the non-standard <var> tag, etc.  Some
# browsers, notably IE8, do some whitespace normalization on these
# tags, thinking they're HTML.  This is a problem for javascript,
# where newlines can have meaning (they're equivalent to ; in some
# contexts, and they terminate //-style comments).  By uglifying
# the javascript first, we normalize it to a form where whitespace
# is *not* meaningful: uglifying strips out //-style comments, and it
# inserts ; every place newlines are implicitly substituting for ;.
#
# The above suggests there's no need to uglify js with no newlines,
# and indeed we avoid doing that, for efficiency.



# Usage modes:
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

def uglify(js)
  if js =~ /\n/
    return @uglifier.compile(js)    
  else
    return js
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
    var.content = uglify(exp).gsub(/;$/, "")
  end

  doc.css(".graphie", "div.guess", "div.show-guess", "div.show-guess-solutionarea").each do |graphie|
    if graphie.elements.any?
      $stderr.puts "-- error: JS element has children"
      exit 1
    end

    js = graphie.content
    graphie.content = uglify(js).gsub(/;$/, "")
  end

  doc.css("div.validator-function").each do |validator|
    if validator.elements.any?
      $stderr.puts "-- error: JS element has children"
      exit 1
    end

    # Need to wrap validator-function content in a function, so uglifier
    # doesn't get confused by the estranged 'return' statement
    js = "(function(){" + validator.content + "})()"
    uglified = uglify(js)

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
      el[data_attr] = uglify(js).gsub(/;$/, "")
    end
  end

  # Done!
  return doc.to_html
end


# args are a series of filenames or infile::outfile strings.  If just
# a filename is given for argv[i], it is treated as filename::<stdout>.
# If no args are given at all, we process [<stdin>::<stdout>]; that
# is, the script is used as a filter.
args = ARGV || ['-']
args.each do |f|
  (infile_name, outfile_name) = f.split(/::/)
  if infile_name == '-'
    input = $stdin.read
  else
    input = File.open(infile_name).read
  end

  output = pack_file(input)

  if outfile_name
    File.open(outfile_name, 'w') do |outfile|
      outfile.puts output
    end
  else
    puts output
  end
end

# ruby wants to do some expensive cleanup we don't care about.  Short-circuit.
$stdout.flush
exit! 0
