import {Navigate,useParams} from 'react-router-dom';
// Preserve bookmarked routes. Old records remain in the database.
export default function ProgramaRoute(){const {phone}=useParams();return <Navigate replace to={phone?`/programas/${phone}`:'/programas'}/>;}
