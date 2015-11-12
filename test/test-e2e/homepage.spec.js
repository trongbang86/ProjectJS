describe('Homepage', function(){
	it('can render the homagepage', function(done){
		browser.driver.get('http://localhost:3000/');
		browser.driver.getCurrentUrl().then(function(url){
			expect(url).to.eq('http://localhost:3000/');
			done();
		});
	});
});