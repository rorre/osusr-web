osu! rebalance calculator
=========================

## API
### /c?user=<Username>
Gets post-rebalance info about <Username>

#### Parameter
user : String = Target player's username
  
#### Response
A JSON object containing post-rebalance info
```json
{
	'LivePP'      : 4788.27,                // Current osu! pp 
	'LocalPP'     : 2724.0156626592197,     // Post-rebalance pp
	'Username'    : 'frozz',
	'DisplayPlays': [{
		"BeatmapID"    :1762728,
		"BeatmapName"  :"Will Stetson - Harumachi Clover (Swing Arrangement) [Dictate Edit] (Sotarks) [Insane]",
		"LivePP"       :243.583,
		"LocalPP"      :145.74175458810808,
		"PPDelta"      :-97.84124541189192,
		"PositionDelta":3
	}, { ... }, { ... }]
}
```