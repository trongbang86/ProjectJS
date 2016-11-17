describe('Routes', function(){
	it('can load routes into their own base url', function(){
        expect(TestProject.routes['/ThisIsForTestingOnly']).to.exist;
	});
});
