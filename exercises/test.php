<?php
require_once('simpletest/unit_tester.php');
require_once('simpletest/reporter.php');
require_once('../classes/log.php');

class TestOfLogging extends UnitTestCase {

function testCreatingNewFile() {
        @unlink('/temp/test.log');
        $log = new Log('/temp/test.log');
        $this->assertFalse(file_exists('/temp/test.log'));
        $log->message('Should write this to a file');
        $this->assertTrue(file_exists('/temp/test.log'));
    }
}
$test = &new TestOfLogging();
$test->run(new HtmlReporter());

?>



