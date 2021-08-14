import React, { useState } from 'react';

const EditOrAddContact = ({ contactName, contactDob, contactCountry, contactEmail, onSubmit, onCancel }) => {
    const [name, setName] = useState(contactName);
    const [country, setCountry] = useState(contactCountry);
    const [email, setEmail] = useState(contactEmail);
    const [dob, setDob] = useState(contactDob);
    const [errorMessage , setErrorMessage] = useState('');
    const action = !contactName && !contactCountry && !contactEmail && !contactDob ? 'Add' : 'Edit';

const handleSubmit = () => {
    if(!name || !country || !email || !dob) {
        setErrorMessage("Some Fields are Empty. Please update them");
        return;
    }
    onSubmit(name, country, email, dob, action);
}

const handleChange = (val, setter) => {
    setter(val);
}

const handleCancel = () => {}

    return ( <div className='user-data'>
    <div>Name: <input value={name} onChange={(e) => handleChange(e.target.value, setName)} /> </div>
    <div>Country: <input value={country} onChange={(e) => handleChange(e.target.value, setCountry)}/></div>
    <div>Email: <input value={email} onChange={(e) => handleChange(e.target.value, setEmail)}/></div>
    <div>Date of Birth: <input value={dob} onChange={(e) => handleChange(e.target.value, setDob)}/></div>
    <button onClick={handleSubmit}>Submit</button>
    <button onClick={() => onCancel()}>Cancel</button>
    <h3>{errorMessage}</h3>
    </div>  );
}
 
export default EditOrAddContact;