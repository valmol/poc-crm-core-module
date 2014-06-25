describe( 'check if mainAppCtrl is defined', function() {
    var cobAppCtrl, $location, $scope;

    beforeEach( module( 'iguana.next' ) );

    beforeEach( inject( function( $controller, _$location_, $rootScope ) {
      $location = _$location_;
      $scope = $rootScope.$new();
      cobAppCtrl = $controller( 'mainAppCtrl', { $location: $location, $scope: $scope });
    }));

    it( 'mainAppCtrl shall not be null', inject( function() {
      expect( cobAppCtrl ).toBeTruthy();
    }));
});
