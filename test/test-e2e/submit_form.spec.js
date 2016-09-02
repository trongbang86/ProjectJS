describe('Form', function(){
	it('can be submitted', function(){
		var url = 'http://localhost:3000/';
		browser.driver.get(url);

		var data = helper.readCSV('./test/data/submit_form.csv');

		_.each(data, function(row) {
			helper.fillValue(row[0], row[1]);
		});
	
		helper.takeScreenshot('./.tmp/screenshot.png');

		helper.click('Submit');

		helper.expectContainText('h1', 'Form Submitted');

	});

});
