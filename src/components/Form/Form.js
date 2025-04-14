import React, { useState } from 'react';
import './form.css';
import { useDispatch, useSelector } from 'react-redux';
import { submitRecord } from '../../store/interactions';

const Form = () => {
  const account = useSelector((state) => state.provider.account);
  const provider = useSelector((state) => state.provider.connection);
  const medical = useSelector((state) => state.medical.contract);
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bloodType, setBloodType] = useState('');
  const [allergies, setAllergies] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();
    await submitRecord(
      name,
      age,
      gender,
      bloodType,
      allergies,
      diagnosis,
      treatment,
      provider,
      medical,
      dispatch
    );
    setName('');
    setAge('');
    setGender('');
    setBloodType('');
    setAllergies('');
    setDiagnosis('');
    setTreatment('');
  };

  return (
    <div className="form-container">
      {account ? (
        <form onSubmit={submitHandler}>
          <h1>Patient Details</h1>

          <label htmlFor="name">Patient's Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John Doe"
          />

          <label htmlFor="age">Age:</label>
          <input
            type="number"
            id="age"
            name="age"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="30"
          />

          <label htmlFor="gender">Gender:</label>
          <select
            id="gender"
            name="gender"
            required
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="" disabled>Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="bloodType">Blood Type:</label>
          <input
            type="text"
            id="bloodType"
            name="bloodType"
            required
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            placeholder="A Positive"
          />

          <label htmlFor="allergies">Allergies:</label>
          <input
            type="text"
            id="allergies"
            name="allergies"
            required
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="None"
          />

          <label htmlFor="diagnosis">Diagnosis:</label>
          <input
            type="text"
            id="diagnosis"
            name="diagnosis"
            required
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="Hypertension"
          />

          <label htmlFor="treatment">Treatment:</label>
          <input
            type="text"
            id="treatment"
            name="treatment"
            required
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="Medication"
          />

          <input type="submit" value="Submit" />
        </form>
      ) : (
        <h1>Please connect your wallet first</h1>
      )}
    </div>
  );
};

export default Form;
