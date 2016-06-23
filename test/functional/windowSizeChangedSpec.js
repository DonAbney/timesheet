describe('when the window size changes', function() {
  beforeEach(function() {
    var fixture = "<div id='fixture' class='wrapper-generatedView'></div>";
    document.body.insertAdjacentHTML('afterbegin', fixture);
    TimesheetView.displayTimesheetInfo('tjones', generateTimesheetInfo());
  });

  afterEach(function() {
    document.body.removeChild(document.getElementById('fixture'));
  });

  it('it should resize the position header to match the size of the day header, so that the positions line up with their respective rows', function() {
    TimesheetView.windowSizeChanged();

    expect($('.positionHeader').height()).toEqual($('.dayHeader').height());
  });
});
