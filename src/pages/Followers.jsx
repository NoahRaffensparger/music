import { Link } from 'react-router-dom';

export default function Followers() {

    return (
        <>
           <div className="mt-12">
                <div>
                    <Link to='/' className='font-medium mx-2'>{`< back`}</Link>
                </div>
           </div>
        </>
    );
}
