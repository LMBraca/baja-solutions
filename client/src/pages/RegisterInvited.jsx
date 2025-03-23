import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import LoadingSpinner from "../components/LoadingSpinner";

// Common country codes for dropdown
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

export default function RegisterInvited() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    areaCode: "+1", // Default to US/Canada code
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecking, setTokenChecking] = useState(true);
  const [pageLoading, setPageLoading] = useState(true);
  const [contentReady, setContentReady] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Get token and email from URL
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    const validateToken = async () => {
      if (!token || !email) {
        setTokenValid(false);
        setTokenChecking(false);
        return;
      }

      try {
        const res = await fetch("/api/auth/validate-invite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, email }),
        });

        const data = await res.json();
        if (data.success === false) {
          setTokenValid(false);
          setError(data.message);
        } else {
          setTokenValid(true);
          setFormData((prev) => ({ ...prev, email }));
        }
      } catch (error) {
        setTokenValid(false);
        setError("An error occurred validating your invitation");
      } finally {
        setTokenChecking(false);
      }
    };

    validateToken();

    const timer = setTimeout(() => {
      setPageLoading(false);
      setContentReady(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [token, email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.phoneNumber) {
      setError("Phone number is required");
      return;
    }

    // Combine area code and phone number
    const fullPhoneNumber = `${formData.areaCode} ${formData.phoneNumber}`;

    try {
      setLoading(true);
      const res = await fetch("/api/auth/register-invited", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email,
          password: formData.password,
          phoneNumber: fullPhoneNumber, 
          token,
        }),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      navigate("/admin");
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {pageLoading && <LoadingSpinner />}

      {!pageLoading && (
        <PageTransition isLoading={!contentReady}>
          <div className="p-3 max-w-lg mx-auto">
            <h1 className="text-xl sm:text-2xl text-center font-semibold my-4 sm:my-6">
              Complete Your Registration
            </h1>

            {tokenChecking ? (
              <p className="text-center">Validating your invitation...</p>
            ) : tokenValid ? (
              <>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">Email</label>
                    <input
                      type="email"
                      value={email}
                      className="border-0 p-3 rounded-lg bg-slate-100 text-gray-500"
                      disabled
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">Username</label>
                    <input
                      type="text"
                      placeholder="Username"
                      className="border-0 p-3 rounded-lg bg-white"
                      id="username"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">Phone Number</label>
                    <div className="flex gap-2">
                      <select
                        id="areaCode"
                        className="border-0 p-3 rounded-lg bg-white w-1/3"
                        value={formData.areaCode}
                        onChange={handleChange}
                      >
                        {countryCodes.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.code} ({country.country})
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        placeholder="Phone Number"
                        className="border-0 p-3 rounded-lg bg-white flex-1"
                        id="phoneNumber"
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">Password</label>
                    <input
                      type="password"
                      placeholder="Password"
                      className="border-0 p-3 rounded-lg bg-white"
                      id="password"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">Confirm Password</label>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      className="border-0 p-3 rounded-lg bg-white"
                      id="confirmPassword"
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <button
                    disabled={loading}
                    className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-75"
                  >
                    {loading ? "Creating Account..." : "Complete Registration"}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center">
                <p className="text-red-500">
                  Invalid or expired invitation link.
                </p>
                <p className="mt-4">
                  Please contact the administrator who invited you for a new
                  invitation.
                </p>
              </div>
            )}

            {error && <p className="text-red-500 mt-5">{error}</p>}
          </div>
        </PageTransition>
      )}
    </div>
  );
}
