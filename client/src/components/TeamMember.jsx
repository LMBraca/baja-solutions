import React from "react";
import { FaUser, FaEnvelope, FaPhone, FaLinkedin } from "react-icons/fa";

const TeamMember = ({ name, position, email, phone, linkedin, image }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden max-w-xs mx-auto">
      <div className="p-4 flex flex-col items-center">
        {/* Profile Image */}
        <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200 flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <FaUser className="text-gray-400 text-5xl" />
          )}
        </div>

        {/* Member Info */}
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-600 mb-3">{position}</p>

        {/* Contact Info */}
        <div className="w-full space-y-2 mt-2">
          {email && (
            <div className="flex items-center text-gray-700">
              <FaEnvelope className="mr-2 text-slate-500" />
              <a href={`mailto:${email}`} className="hover:text-blue-500">
                {email}
              </a>
            </div>
          )}

          {phone && (
            <div className="flex items-center text-gray-700">
              <FaPhone className="mr-2 text-slate-500" />
              <a href={`tel:${phone}`} className="hover:text-blue-500">
                {phone}
              </a>
            </div>
          )}

          {linkedin && (
            <div className="flex items-center text-gray-700">
              <FaLinkedin className="mr-2 text-slate-500" />
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500"
              >
                Perfil de LinkedIn
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMember;
