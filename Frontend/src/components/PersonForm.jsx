const PersonForm = ({
  addPerson,
  newName,
  handlePersonChange,
  phoneNumber,
  handlePhoneNumber,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handlePersonChange} />
      </div>
      <div>
        number: <input value={phoneNumber} onChange={handlePhoneNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default PersonForm;
