// Finance.js
import React, { useState } from 'react';
import './styles.css';

const Finance = () => {
    const [activeSection, setActiveSection] = useState('current');

    return (
        <div className="finance-container">
            <div className="finance-header">
                <div className={`section-tab ${activeSection === 'current' ? 'active' : ''}`}
                    onClick={() => setActiveSection('current')}>
                    Current SOC
                </div>
                <div style={{display:"none"}} className={`section-tab ${activeSection === 'example' ? 'active' : ''}`}
                    onClick={() => setActiveSection('example')}>
                    Example section
                </div>
            </div>

            {activeSection === 'current' && (
                <>
                    <h2 className="finance-title">Current Schedule of charges</h2>

                    <div className="finance-grid">
                        <div className="finance-card">
                            <h3 className="card-title">Service fee</h3>
                            <div className="percentage">24.00%</div>
                            <div className="subtitle">Regular orders</div>
                        </div>

                        <div className="finance-card">
                            <h3 className="card-title">Merchant Cancellation Charges</h3>
                            <div className="charge-item">
                                <div className="subtitle">
                                    {`Order cancelled by merchant >0.5% and <2%`}
                                </div>
                                <div className="charge">10.0% without taxes</div>
                            </div>
                            <div className="charge-item">
                                <div className="subtitle">
                                    {`Order cancelled by merchant >0.5% and <2%`}
                                </div>
                                <div className="charge">10.0% without taxes</div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {activeSection === 'example' && (
                <div className="example-section">
                    <h2 className="finance-title">Example Section Content</h2>
                    {/* Add your example section content here */}
                </div>
            )}
        </div>
    );
};

export default Finance;