import { useState } from "react";

const countryCodes = [
  { code: "+1", country: "US/Canada" },
  { code: "+44", country: "UK" },
  { code: "+52", country: "Mexico" },
  { code: "+33", country: "France" },
  { code: "+49", country: "Germany" },
  { code: "+34", country: "Spain" },
  { code: "+39", country: "Italy" },
  { code: "+81", country: "Japan" },
  { code: "+86", country: "China" },
  { code: "+91", country: "India" },
  { code: "+55", country: "Brazil" },
  { code: "+61", country: "Australia" },
];

const [phoneNumberParts, setPhoneNumberParts] = useState({
  areaCode: "+1",
  number: "",
});

const handlePhoneChange = (e) => {
  setPhoneNumberParts({
    ...phoneNumberParts,
    [e.target.id]: e.target.value,
  });

  // Update the formData with the full phone number
  setFormData({
    ...formData,
    phoneNumber: `${
      e.target.id === "areaCode" ? e.target.value : phoneNumberParts.areaCode
    } ${e.target.id === "number" ? e.target.value : phoneNumberParts.number}`,
  });
};

<div className="flex flex-col gap-1">
  <label className="text-sm font-medium">Phone Number</label>
  <div className="flex gap-2">
    <select
      id="areaCode"
      className="border p-3 rounded-lg w-1/3"
      value={phoneNumberParts.areaCode}
      onChange={handlePhoneChange}
    >
      {countryCodes.map((country) => (
        <option key={country.code} value={country.code}>
          {country.code} ({country.country})
        </option>
      ))}
    </select>
    <input
      type="tel"
      placeholder="Phone number"
      id="number"
      className="border p-3 rounded-lg flex-1"
      value={phoneNumberParts.number}
      onChange={handlePhoneChange}
      required
    />
  </div>
</div>;
