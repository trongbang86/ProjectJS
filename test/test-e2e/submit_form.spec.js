describe('Form', function(){
	it('can be submitted', function(){
		var url = 'http://localhost:3000/';
		browser.driver.get(url);
		
		helper.fillValue('#fname', 'Greg');
		helper.fillValue('#lname', 'Smith');
		helper.fillValue('#gender', 'male');
		helper.fillValue('#emailAddress', 'Greg.Smith@rba.gov.au');
		helper.fillValue('#workPhoneNumber', '95519628');
		helper.fillValue('#homePhoneNumber', '041234567');
		helper.fillValue('#address', '65 Martin Place, Sydney NSW');
		helper.fillValue('#city', 'Sydney');
		helper.fillValue('#state', 'NSW');
		helper.fillValue('#country', 'Australia');
		helper.fillValue('#zipcode', '2000');

		helper.takeScreenshot('./.tmp/screenshot.png');

		helper.click('Submit');

		helper.expectContainText('h1', 'Form Submitted');

	});
});
