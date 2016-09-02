describe('Form', function() {
	var url = 'http://localhost:3000/';

	beforeEach(function() {
		browser.driver.get(url);
		
		var data = helper.readCSV('./test/data/submit_form.csv');

		_.each(data, function(row) {
			helper.fillValue(row[0], row[1]);
		});

	});

	var testCases= [
		['First Name', '#fname'],
		['Email Address', '#emailAddress'],
		['Work Phone Number', '#workPhoneNumber']
	];

	_.each(testCases, function(testCase) {
		it("can't be submitted with missing " + testCase[0], function() {
			helper.fillValue(testCase[1], '');
			helper.click('Submit');
			browser.getCurrentUrl().then(function(currentUrl) {
				expect(currentUrl).to.eq(url);
			});
		});
	});

	
});