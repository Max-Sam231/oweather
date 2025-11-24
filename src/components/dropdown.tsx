'use client';

import { useState } from 'react';
import styles from './compStyles.module.css';


export default function Dropdown() {
    const options = ['Омск', 'Москва', 'Сочи'];
    
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(options[0]);

    return(
        <div className={styles.container} style={{ display: 'flex', paddingRight: '200px' }}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={styles.button}
            >
                {selected}
            </button>
            {isOpen && (
                <div className={styles.dropdownList} style={{ paddingRight: '200px' }}>
                    {options.map((option) => (
                        <div key={option} onClick={() => {setSelected(option); setIsOpen(false);}} className={styles.dropdownItem}>{option}</div>
                    ))}
                </div>
            )}
        </div>
    )
}