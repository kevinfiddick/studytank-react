import React, { Component } from "react";
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import Panel from 'react-bootstrap/lib/Panel'
import Typography from '@material-ui/core/Typography'
import {Container, Row, Col} from 'reactstrap'
import MoreInfo from './moreinfopanel'
import CommentInput from './commentinput'
import Comment from './comment'




const styles = theme => ({
  root: {
    width: '50px',
    color: 'blue'
  }
})

const noteinfo= {
  "_id": "1530142349458",
  "_rev": "1-8dd5ea8122745b81b6d4ed89acabe968",
  "title": "Capitals of the 50 States",
  "content": "1. **Alabama** - Montgomery\n2. **Alaska** - Juneau\n3. **Arizona** - Phoenix\n4. **Arkansas** - Little Rock\n5. **California** - Sacramento\n6. **Colorado** - Denver\n7. **Connecticut** - Hartford\n8. **Delaware** - Dover\n9. **Florida** - Tallahassee\n10. **Georgia** - Atlanta\n11. **Hawaii** - Honolulu\n12. **Idaho** - Boise\n13. **Illinois** - Springfield\n14. **Indiana** - Indianapolis\n15. **Iowa** - Des Moines\n16. **Kansas** - Topeka\n17. **Kentucky** - Frankfort\n18. **Louisiana** - Baton Rouge\n19. **Maine** - Augusta\n20. **Maryland** - Annapolis\n21. **Massachusetts** - Boston\n22. **Michigan** - Lansing\n23. **Minnesota**- St. Paul\n24. **Mississippi** - Jackson\n25. **Missouri** - Jefferson City\n26. **Montana** - Helena\n27. **Nebraska** - Lincoln\n28. **Nevada** - Carson City\n29. **New Hampshire** - Concord\n30. **New Jersey** - Trenton\n31. **New Mexico** - Santa Fe\n32. **New York** - Albany\n33. **North Carolina** - Raleigh\n34. **North Dakota** - Bismarck\n35. **Ohio** - Columbus\n36. **Oklahoma** - Oklahoma City\n37. **Oregon** - Salem\n38. **Pennsylvania** - Harrisburg\n39. **Rhode Island** - Providence\n40. **South Carolina** - Columbia\n41. **South Dakota** - Pierre\n42. **Tennessee** - Nashville\n43. **Texas** - Austin\n44. **Utah** - Salt Lake City\n45. **Vermont** - Montpelier\n46. **Virginia** - Richmond\n47. **Washington** - Olympia\n48. **West Virginia** - Charleston\n49. **Wisconsin** - Madison\n50. **Wyoming** - Cheyenne",
  "author": "mlohmeier16@gmail.com",
  "authorFirstname": "Matthew",
  "authorLastname": "Lohmeier",
  "authorPicture": "",
  "subject": "Social Studies",
  "school": "",
  "date": "2018-06-27",
  "isFact": "true",
  "language": "EN",
  "textbook": "https://www.memory-improvement-tips.com/list-of-states-capitals.html",
  "saved": [],
  "comments": [],
  "rating": [],
  "1530142349458": 1530142349458
}

class Note extends Component {
  defaultProps = {
    value: ''
  }

  state = {
    value: this.defaultProps.value,
  };

  render() {
  return(
    <div>
    <Container>
    <Typography  variant='display3'>
    Note Title
    </Typography>
    <div style={{border: '1px solid'}} >
   <ReactMarkdown source={noteinfo.content} escapeHtml={false}/>
   </div>
   <MoreInfo note={noteinfo}/>
   <hr />
   <CommentInput />
   <hr />
   <Typography variant='display1'>
   Comments
   </Typography>
   <Comment />
     </Container>
   </div>

)
  }
}
export default Note;
