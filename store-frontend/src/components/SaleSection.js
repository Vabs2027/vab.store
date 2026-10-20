import './SaleSection.css';
import SaleIcon from './icons/SaleIcon';

import { NavLink } from 'react-router-dom';


function SaleSection() {
    return (
        <section className='sale-section'>

            <NavLink
                to='/catalog/sale'
                className='sale-link'
            >
                <SaleIcon />

                <h2 className='sale-text'>
                    Акції
                </h2>

            </NavLink>

        </section>
    );
}

export default SaleSection;