describe('Form', function() {
	var url = 'http://localhost:3000/';

	beforeEach(function() {
		browser.driver.get(url);
		
		helper.fillValue('#fname', 'Greg');
		helper.fillValue('#lname', 'Smith');
		helper.fillValue('#emailAddress', 'Greg.Smith@rba.gov.au');
		helper.fillValue('#workPhoneNumber', '95519628');
		helper.fillValue('#homePhoneNumber', '041234567');
		helper.fillValue('#address', '65 Martin Place, Sydney NSW');
		helper.fillValue('#city', 'Sydney');
		helper.fillValue('#state', 'NSW');
		helper.fillValue('#country', 'Australia');
		helper.fillValue('#zipcode', '2000');

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