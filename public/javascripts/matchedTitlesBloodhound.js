var startBloodhound = function(){

  var matchedTitles = new Bloodhound({
      datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      remote: {
        url: '../../responses/responseTitles/%QUERY',
        wildcard: '%QUERY'
      }
  });

  $('#suggestedTitles .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
  }, {
    name: 'matchedTitles',
    source: matchedTitles,
    highlight: true
  });

}