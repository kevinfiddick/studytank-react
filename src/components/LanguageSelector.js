import React from 'react';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default class Language extends React.Component {
	render() {
		return (
			<FormControl fullWidth>
          <InputLabel htmlFor="language">Language: </InputLabel>
          <Select
            value={this.props.value}
            onChange={this.props.onChange}
            inputProps={{
              name: 'language',
              id: 'language',
            }}
          >
					<MenuItem value="EN">English</MenuItem>
					<MenuItem value="AF">Afrikanns</MenuItem>
					<MenuItem value="SQ">Albanian</MenuItem>
					<MenuItem value="AR">Arabic</MenuItem>
					<MenuItem value="HY">Armenian</MenuItem>
					<MenuItem value="EU">Basque</MenuItem>
					<MenuItem value="BN">Bengali</MenuItem>
					<MenuItem value="BG">Bulgarian</MenuItem>
					<MenuItem value="CA">Catalan</MenuItem>
					<MenuItem value="KM">Cambodian</MenuItem>
					<MenuItem value="ZH">Chinese (Mandarin)</MenuItem>
					<MenuItem value="HR">Croation</MenuItem>
					<MenuItem value="CS">Czech</MenuItem>
					<MenuItem value="DA">Danish</MenuItem>
					<MenuItem value="NL">Dutch</MenuItem>
					<MenuItem value="ET">Estonian</MenuItem>
					<MenuItem value="FJ">Fiji</MenuItem>
					<MenuItem value="FI">Finnish</MenuItem>
					<MenuItem value="FR">French</MenuItem>
					<MenuItem value="KA">Georgian</MenuItem>
					<MenuItem value="DE">German</MenuItem>
					<MenuItem value="EL">Greek</MenuItem>
					<MenuItem value="GU">Gujarati</MenuItem>
					<MenuItem value="HE">Hebrew</MenuItem>
					<MenuItem value="HI">Hindi</MenuItem>
					<MenuItem value="HU">Hungarian</MenuItem>
					<MenuItem value="IS">Icelandic</MenuItem>
					<MenuItem value="ID">Indonesian</MenuItem>
					<MenuItem value="GA">Irish</MenuItem>
					<MenuItem value="IT">Italian</MenuItem>
					<MenuItem value="JA">Japanese</MenuItem>
					<MenuItem value="JW">Javanese</MenuItem>
					<MenuItem value="KO">Korean</MenuItem>
					<MenuItem value="LA">Latin</MenuItem>
					<MenuItem value="LV">Latvian</MenuItem>
					<MenuItem value="LT">Lithuanian</MenuItem>
					<MenuItem value="MK">Macedonian</MenuItem>
					<MenuItem value="MS">Malay</MenuItem>
					<MenuItem value="ML">Malayalam</MenuItem>
					<MenuItem value="MT">Maltese</MenuItem>
					<MenuItem value="MI">Maori</MenuItem>
					<MenuItem value="MR">Marathi</MenuItem>
					<MenuItem value="MN">Mongolian</MenuItem>
					<MenuItem value="NE">Nepali</MenuItem>
					<MenuItem value="NO">Norwegian</MenuItem>
					<MenuItem value="FA">Persian</MenuItem>
					<MenuItem value="PL">Polish</MenuItem>
					<MenuItem value="PT">Portuguese</MenuItem>
					<MenuItem value="PA">Punjabi</MenuItem>
					<MenuItem value="QU">Quechua</MenuItem>
					<MenuItem value="RO">Romanian</MenuItem>
					<MenuItem value="RU">Russian</MenuItem>
					<MenuItem value="SM">Samoan</MenuItem>
					<MenuItem value="SR">Serbian</MenuItem>
					<MenuItem value="SK">Slovak</MenuItem>
					<MenuItem value="SL">Slovenian</MenuItem>
					<MenuItem value="ES">Spanish</MenuItem>
					<MenuItem value="SW">Swahili</MenuItem>
					<MenuItem value="SV">Swedish </MenuItem>
					<MenuItem value="TA">Tamil</MenuItem>
					<MenuItem value="TT">Tatar</MenuItem>
					<MenuItem value="TE">Telugu</MenuItem>
					<MenuItem value="TH">Thai</MenuItem>
					<MenuItem value="BO">Tibetan</MenuItem>
					<MenuItem value="TO">Tonga</MenuItem>
					<MenuItem value="TR">Turkish</MenuItem>
					<MenuItem value="UK">Ukranian</MenuItem>
					<MenuItem value="UR">Urdu</MenuItem>
					<MenuItem value="UZ">Uzbek</MenuItem>
					<MenuItem value="VI">Vietnamese</MenuItem>
					<MenuItem value="CY">Welsh</MenuItem>
					<MenuItem value="XH">Xhosa</MenuItem>
          </Select>
        </FormControl>


		);
	}
}
