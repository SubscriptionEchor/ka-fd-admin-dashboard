// import React, { useState } from "react";
// import "./styles.css"; // Import the external CSS file

// const AccountManager = () => {
//   const [activeTab, setActiveTab] = useState("Account Manager"); // State to manage active tab

//   return (
//     <div className="account-manager-container">
//       {/* Tabs */}
//       <div className="tabs">
//         <div
//           className={`tab ${activeTab === "Account Manager" ? "active" : ""}`}
//           onClick={() => setActiveTab("Account Manager")}
//         >
//           Account manager
//         </div>
//         <div
//         style={{display:"none"}}

//           className={`tab ${activeTab === "Example Section" ? "active" : ""}`}
//           onClick={() => setActiveTab("Example Section")}
//         >
//           Example section
//         </div>
//       </div>

//       {/* Content */}
//       <div className="content">
//         {activeTab === "Account Manager" && (
//           <div className="card">
//             <h2 className="card-title">Account Manager Details</h2>
//             <div className="card-details">
//               <p>
//                 <span className="icon">👤</span> John Mathew
//               </p>
//               <p>
//                 <span className="icon">📞</span> (+49) 9876543212
//               </p>
//               <p>
//                 <span className="icon">✉️</span> JohnMathew@gmail.com
//               </p>
//             </div>
//           </div>
//         )}

//         {activeTab === "Example Section" && (
//           <div className="example-section">
//             <h2>Example Section Content</h2>
//             <p>
//               This is an example section where you can add any content you
//               want. Customize this section as needed.
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AccountManager;


import React, { useState } from "react";
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import "./styles.css";


// const GET_RESTAURANT = gql`
//   query Restaurant($restaurantId: String) {
//     restaurant(id: $restaurantId) {
//       quickSearchKeywords
//       accountManagerId
//     }
//   }
// `;

const GET_ACCOUNT_MANAGER = gql`
  query AccountManager($accountManagerId: ID!) {
    accountManager(id: $accountManagerId) {
      _id
      name
      email
      phone
    }
  }
`;

const AccountManager = () => {
  const [activeTab, setActiveTab] = useState("Account Manager");

  // Get token from localStorage
  const token = localStorage.getItem('user-enatega');
  // const restId = localStorage.getItem('restaurantId');

  // const { data: restaurantData } = useQuery(GET_RESTAURANT, {
  //   variables: { restaurantId: restId },
  //   context: {
  //     headers: {
  //       Authorization: `Bearer ${token.token}`
  //     }
  //   }
  // });
  
  // console.log("Restaurant quickSearchKeywords:", restaurantData?.restaurant);


  const { loading, error, data } = useQuery(GET_ACCOUNT_MANAGER, {
    variables: { accountManagerId: 'default' },
    context: {
      headers: {
        Authorization: `Bearer ${token.token}`
      }
    }
  });

  if (loading) {
    return (
      <div className="account-manager-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="account-manager-container">
        <div className="error">Error loading account manager details</div>
      </div>
    );
  }

  const accountManagerData = data?.accountManager;

  return (
    <div className="account-manager-container">
      {/* Tabs */}
      <div className="tabs">
        <div
          className={`tab ${activeTab === "Account Manager" ? "active" : ""}`}
          onClick={() => setActiveTab("Account Manager")}
        >
          Account manager
        </div>
        <div
          style={{display:"none"}}
          className={`tab ${activeTab === "Example Section" ? "active" : ""}`}
          onClick={() => setActiveTab("Example Section")}
        >
          Example section
        </div>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === "Account Manager" && (
          <div className="card">
            <h2 className="card-title">Account Manager Details</h2>
            <div className="card-details">
              <p>
                <span className="icon">👤</span> {accountManagerData?.name || 'N/A'}
              </p>
              <p>
                <span className="icon">📞</span> {accountManagerData?.phone || 'N/A'}
              </p>
              <p>
                <span className="icon">✉️</span> {accountManagerData?.email || 'N/A'}
              </p>
            </div>
          </div>
        )}

        {activeTab === "Example Section" && (
          <div className="example-section">
            <h2>Example Section Content</h2>
            <p>
              This is an example section where you can add any content you
              want. Customize this section as needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccountManager;

