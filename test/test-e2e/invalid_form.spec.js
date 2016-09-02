describe('Form', function() {
	it("can't be submitted with missing First Name", function() {
		var url = 'http://localhost:3000/';
		browser.driver.get(url);
		
		var data = helper.readCSV('./test/data/invalid_form.csv');

		_.each(data, function(row) {
			helper.fillValue(row[0], row[1]);
		});

		helper.click('Submit');
		browser.getCurrentUrl().then(function(currentUrl) {
			expect(currentUrl).to.eq(url);
		});
	});
});