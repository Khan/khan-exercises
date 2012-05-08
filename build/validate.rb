require 'rubygems'
require 'validator.nu'
require 'json'
require 'pp'

files = Dir[File.join(File.dirname(__FILE__), '../exercises/*.html')]

files.each do |file|
  name = File.basename(file, ".html")
  if name =~ /^khan-(?:exercise|site)$/
    puts "skipping #{name}"
    next
  end

  doc = File.read(file)
  doc.gsub!(/<(?!(?:\/?[a-z]+|!DOCTYPE|!--))/, '&lt;')
  # doc.gsub!(/< /, '&lt;')
  doc.gsub!(/&(?![a-z])/, '&amp;')
  doc.gsub!(/ id=".+?"/, "")

  output = JSON.parse(Validator.nu(doc, :host => '127.0.0.1', :port => 8888))

  puts "#{name}" if output["messages"].length > 2
  output["messages"][2..-1].each do |message|
    puts "#{message["type"]} on line #{message["lastLine"]}: #{message["message"]}"[0..79]
  end
end
