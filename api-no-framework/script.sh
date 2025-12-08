echo "Requesting all games"
curl localhost:3000/games

echo \n\n"Requesting with wrong body" 
curl --silent -X POST \
  --data-binary '{ "invalid": "data" }' \
  localhost:3000/games

echo \n\n"Add a game" 
set CREATE $(curl --silent -X POST \
  --data-binary '{ "name": "God of War", "publisher": "SONY", "release_year": 2018 }' \
  localhost:3000/games)
echo "inserted id "$CREATE

set ID $(echo $CREATE | jq .id)

echo \n"Requesting game with ID" $ID
curl localhost:3000/games/$ID