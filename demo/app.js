(function() {
  
  var app = angular.module('app', ['stamp'])
  
  app.controller('AppCtrl', ['$scope', function($scope) {

    $scope.stampMarkup = {
      blocks: [
        {
          attributes: {
            layout: 'oneColumn'
          },
          columns: [
            {
              components: [
                {
                  type: 'title',
                  data: {
                    value: 'Rodrigo Strong hangs tough, leads UKIPT Marbella final table',
                    size: 1
                  }
                },
                {
                  type: 'title',
                  data: {
                    value: 'by Nick Wright on June 18, 2016 11:23 AM',
                    size: 2 
                  }
                },
                {
                  type: 'html',
                  data: '[HTML Social share icons]'
                },
                {
                  type: 'image',
                  data: {
                    url: 'rodrigo.jpg',
                    link: '#',
                    label: 'A strong performance from Rodrigo today',
                    alt: 'Rodrigo playing poker with a large stack'
                  }
                },
                {
                  type: 'text',
                  data: 'Fifty-five players returned today and while we could only guess at which eight would make the final table, from a long way out it seemed a near certainty that Rodrigo Strong would be amongst them.'
                },
                {
                  type: 'text',
                  data: "The overnight chip leader went from strength to strength today and never lost top spot on the leaderboard as he powered his way to the final table. A cooler of a hand against Janina Burger, in which they both flopped trips, meant he had almost a quarter of the chips in play with 22 players left and he further increased his stack to end the day on 7,2350,000. Good for 34% of the chips in play. The LAPT9 Chile champion is having a fantastic year and just as in March, when he won his LAPT title, he'll start the final day as chip leader."
                },
                {
                  type: 'title',
                  data: {
                    value: 'Final table chip counts:',
                    size: 2 
                  }
                },
                {
                  type: 'table',
                  data: {
                    rows: [ // No idea how this should actually be structured
                      [ { type: 'th', value: 'Seat' }, { type: 'th', value: 'Name' }, { type: 'th', value: 'Country' }, { type: 'th', value: 'Status' }, { type: 'th', value: 'Chips' } ]
                    ]
                  }
                },
                {
                  type: 'text',
                  data: "The following is about Strong from our LAPT blog in March: \"he scored knockout after knockout, winning nearly every all-in encounter he found himself involved in en route to ending the night with the eight-handed chip lead.\""
                },
                {
                  type: 'html',
                  data: "<p class=\"quote\">Have events in Marbella inspired you to start playing poker? <a href=\"#\">Click here to open a PokerStars account.</a></p>"
                },
                {
                  type: 'text',
                  data: "That quote is equally apt today as Strong barely put a chip wrong and to highlight just one hand, he made quads to eliminate Alejandro Vazquez in 12th place. He almost always had double the chips of whichever player occupied second place. In short, he crushed it."
                },
                {
                  type: 'image',
                  data: {
                    url: 'janssens.jpg',
                    link: '#',
                    label: 'A good day for Janssens',
                    alt: 'Janssens playing poker'
                  }
                },
                {
                  type: 'text',
                  data: "It's a cosmopolitan final table with no less than seven nationalities represented and unlike Strong, who knows what it's like to win a major poker tournament, the vast majority of those who line up behind him are still waiting for their breakout result."
                }
              ]
            }
          ]
        },
        {
          attributes: {
            layout: 'twoColumn'
          },
          columns: [
            {
              components: [
                {
                  type: 'title',
                  data: {
                    value: 'Janssens Photo Title',
                    size: 1
                  }
                },
                {
                  type: 'image',
                  data: {
                    url: 'janssens.jpg',
                    link: '#',
                    label: 'image 1'
                  }
                }
              ]
            },
            {
              components: [
                {
                  type: 'title',
                  data: {
                    value: 'Rodrigo Photo Title',
                    size: 1
                  }
                },
                {
                  type: 'image',
                  data: {
                    url: 'rodrigo.jpg',
                    alt: 'image 2 alt'
                  }
                }
              ]
            }
          ]
        }
      ]
    }


    /*$scope.stampMarkup = {
      blocks: [
        {
          attributes: {
            layout: 'oneColumn'
          },
          columns: [
            {
              components: [
                {
                  type: 'title',
                  data: 'Hello World!'
                }
              ]
            }
          ]
        },
        {
          attributes: {
            layout: 'twoColumn'
          },
          columns: [
            {
              components: [
                {
                  type: 'title',
                  data: 'Hello World Left Title!'
                }
              ]
            },
            {
              components: [
                {
                  type: 'text',
                  data: 'Hello World Right Text!'
                }
              ]
            }
          ]
        },
        {
          //attributes: {
          //  layout: undefined // Will default to fluid
          //},
          columns: [
            {
              components: [
                {
                  type: 'text',
                  data: 'Fluid block [Item 1]'
                },
                {
                  type: 'text',
                  data: 'Fluid block [Item 2]'
                },
                {
                  type: 'text',
                  data: 'Fluid block [Item 3]'
                }
              ]
            }
          ]
        }
      ]
    }*/

    // testing external ngModel changes
    $scope.changeModel = function() {
      $scope.stampMarkup.blocks.push({
          attributes: {
            layout: 'oneColumn'
          },
          columns: [
            {
              components: [
                {
                  type: 'text',
                  data: 'NEW COMPONENT'
                }
              ]
            }
          ]
        })
    }
    
  }])
  
}())