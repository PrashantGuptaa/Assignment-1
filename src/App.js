import "./App.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import NameCard from "./Components/nameCard";
import EditOrAddContact from "./Components/EditOrAddContact";
const _ = require('lodash');

function App() {
  const [searchInput, setSearchInput] = useState("");
  const [serverResponse, setServerResponse] = useState([]);
  const [totalContacts, setTotalContacts] = useState(0);
  const [displayedContacts, setDisplayedContacts] = useState([]);
  const [indexofFirstContact, setIndexOfFirstContact] = useState(0);
  const [indexOfLastContact, setIndexOfLastContact] = useState(1);
  const [loadingComplete, setLoadingComplete] = useState(false);
  let [contactUsedToShow, setContactUsedToShow] = useState([]);
  const [newName, setNewName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDob, setNewDob] = useState('');
  const [editOrAdd, setEditOrAdd] = useState(true);
  const [changeId, setChangeId] = useState(null);

  const contactPerPage = 5;

  useEffect(async () => {
    try {
      const response = await axios.get("http://localhost:5000/users");
      const { data } = response;
      setServerResponse(data);
      setTotalContacts(data.length);
      setIndexOfLastContact(contactPerPage);
      contactUsedToShow = _.cloneDeep(data);
      displayedContactsValue(0, contactPerPage, contactUsedToShow);
      setContactUsedToShow(contactUsedToShow);
      setLoadingComplete(true);
    } catch (e) {
      console.error("Error while loading data", e);
    }
  }, []);

  const handleChange = (val, setter, action) => {
    setter(val);
    if(action === 'search' && !val) {
      setIndexOfFirstContact(0);
      setIndexOfLastContact(contactPerPage);
      setTotalContacts(serverResponse.length);
      setContactUsedToShow(_.cloneDeep(serverResponse));
      displayedContactsValue(0, contactPerPage, serverResponse);
    }
  };

  const displayedContactsValue = (indexofFirstContact,  indexOfLastContact, data) => {
    const temp = data.slice(indexofFirstContact, indexOfLastContact);
    setDisplayedContacts(temp);
  }

const  checkDisabled = (action) => {
    if(action === 'decrease' && indexofFirstContact <= 0)
    return true;
    if(action === 'increase' && indexofFirstContact >= totalContacts)
    return true;
    return false;
  }

  const handlePagination = (action) => {
    setLoadingComplete(false);
    let firstIndex, lastindex;
    if(action === 'increase') {
      firstIndex = indexofFirstContact + contactPerPage;
      lastindex = indexOfLastContact + contactPerPage;
      setIndexOfLastContact(lastindex);
      setIndexOfFirstContact(firstIndex);
      displayedContactsValue(firstIndex, lastindex, contactUsedToShow);
    } else {
      firstIndex = indexofFirstContact - contactPerPage;
      lastindex = indexOfLastContact - contactPerPage;
      setIndexOfLastContact(lastindex);
      setIndexOfFirstContact(firstIndex);
      displayedContactsValue(firstIndex, lastindex, contactUsedToShow);
    }
    setLoadingComplete(true);
  }

  const handleSearch = () => {
    const filteredContacts = serverResponse.filter((userData) => {
      const {
        Country: country,
        ["Date of birth"]: dob,
      } = userData;
      if(country.toUpperCase() === searchInput.toUpperCase() || dob.slice(0,4) === searchInput){
        return userData;
      }
    })
    setTotalContacts(filteredContacts.length);
    setIndexOfFirstContact(0);
    setIndexOfLastContact(contactPerPage);
    setContactUsedToShow(filteredContacts);
    displayedContactsValue(0, contactPerPage, filteredContacts);
  }

  const handleEditAndDelete = (id, action) => {
    if(action === 'delete') {
      let indexVal = null
     contactUsedToShow.forEach((userData, index) => {
        const { Id } = userData;
        if(Id === id)
        indexVal = index;
      })
      contactUsedToShow.splice(indexVal, 1);
      serverResponse.splice(indexVal, 1);
     
      setContactUsedToShow(contactUsedToShow);
      setServerResponse(serverResponse);
      setTotalContacts(contactUsedToShow.length);
      displayedContactsValue(indexofFirstContact, indexOfLastContact, contactUsedToShow);
    }
    if(action === 'edit') {
      contactUsedToShow.forEach((userData, index) => {
        const {
          ["Full Name"]: name,
          Country: country,
          Id,
          ["Date of birth"]: dob,
          Email,
        } = userData;
        if(Id === id){
          setChangeId(Id);
          setNewName(name);
          setNewCountry(country);
          setNewEmail(Email);
          setNewDob(dob);
          setEditOrAdd(false);
          }
      })
    }
  }

  

  const displayNamCards = () => {
    let arr = [];
    displayedContacts.length > 0 ?(
    displayedContacts.forEach((userData) => {
      const {
        ["Full Name"]: name,
        Country: country,
        Id,
        ["Date of birth"]: dob,
        Email,
      } = userData;
      arr.push(
        <NameCard
          name={name}
          country={country}
          dob={new Date(dob).toDateString()}
          email={Email}
          key={Id}
          id={Id}
          handleEditAndDelete={handleEditAndDelete}
        />
      );
    })
) : arr.push(
<h1>
  {`No Result found for ${searchInput}`}
</h1>
)
    return arr;
  };

  const getPagination = () => {
    return (
      <div>
        <button onClick={() => handlePagination('decrease')} disabled={checkDisabled('decrease')} >{"<"}</button>
        {`    Showing ${indexofFirstContact + 1}-${indexOfLastContact}: Out of ${totalContacts} Results    `}
        <button onClick={() => handlePagination('increase')} disabled={checkDisabled('increase')}>{">"}</button>
      </div>
    );
  };

  const reInitialiseNewContactValues = () => {
    setNewName('');
    setNewEmail('');
    setNewCountry('');
    setNewDob('');
    setChangeId(null);
  }

  const handleEditOrAddCancel = () => {
    reInitialiseNewContactValues();
    setEditOrAdd(true);
  }

  const handleEditOrAddSubmit = (contactName, contactCountry, contactEmail, contactDob, action) => {
    if(action === 'Edit') {
      contactUsedToShow.forEach((userData, index) => {
        let {
          Id,
        } = userData;
        if(Id === changeId){

          contactUsedToShow[index]["Full Name"] = contactName;
          contactUsedToShow[index].Email= contactEmail;
          contactUsedToShow[index].Country = contactCountry;
          contactUsedToShow[index]["Date of birth"] = contactDob;
          setContactUsedToShow(contactUsedToShow);
          displayedContactsValue(indexofFirstContact, indexOfLastContact, contactUsedToShow);
          }
      })

      serverResponse.forEach((userData, index) => {
        let {
          Id,
        } = userData;
        if(Id === changeId){

          serverResponse[index]["Full Name"] = contactName;
          serverResponse[index].Email= contactEmail;
          serverResponse[index].Country = contactCountry;
          serverResponse[index]["Date of birth"] = contactDob;
          setServerResponse(serverResponse);
          reInitialiseNewContactValues();
          setEditOrAdd(true);
          }
      })
    }

    if(action === 'Add') {
      const newContact = {
        ['Full Name']: contactName,
        Country: contactCountry,
        Email: contactEmail,
        ['Date of birth']: contactDob,
        Id: changeId
      }
      serverResponse.push(newContact);
      contactUsedToShow.push(newContact);
      setContactUsedToShow(contactUsedToShow);
          displayedContactsValue(indexofFirstContact, indexOfLastContact, contactUsedToShow);
          setServerResponse(serverResponse);
          setTotalContacts(contactUsedToShow.length);
          reInitialiseNewContactValues();
          setEditOrAdd(true);
    }
  }

  const handleAddNewContact = () => {
    let newId = serverResponse[totalContacts - 1].Id + 1;
    setChangeId(newId);
    setEditOrAdd(false);
  }

  return (
    <div className="App">
   {editOrAdd ?   
   <>
   {loadingComplete ? (
        <>
          <input
            type="search"
            onChange={(e) => handleChange(e.target.value, setSearchInput, 'search')}
            value={searchInput}
            placeholder={"Search by Country/Year of birth"}
          />
          <button onClick={handleSearch}>Search</button>
          <div><button onClick={handleAddNewContact}>Add New Contact</button></div>
          <div className="display-card">{displayNamCards()}</div>

          <div>{getPagination()}</div>
        </>
      ) : (
        <h1>Loading...</h1>
      )}
      </>
      : <EditOrAddContact contactName={newName} contactCountry={newCountry} contactEmail={newEmail} contactDob={newDob} onCancel={handleEditOrAddCancel} onSubmit={handleEditOrAddSubmit} />}
    </div>
  );
}

export default App;
