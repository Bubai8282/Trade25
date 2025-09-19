"use client";

import React, { useState, useEffect } from 'react';
import ChartVision from './ChartVision';

const StockScreening = () => {
    const [screenings, setScreenings] = useState([]);
    const [selectedScreening, setSelectedScreening] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newScreening, setNewScreening] = useState({
        name: '',
        criteria: {
            min_price: '',
            max_price: '',
            min_volume: '',
            min_market_cap: '',
            pe_ratio_max: '',
            sectors: []
        }
    });

    useEffect(() => {
        fetchScreenings();
    }, []);

    const fetchScreenings = async () => {
        try {
            const response = await fetch('/admin/api/stock-screenings');
            const data = await response.json();
            if (data.success) {
                setScreenings(data.screenings);
            }
        } catch (error) {
            console.error('Failed to fetch screenings:', error);
        }
        setLoading(false);
    };

    const createScreening = async () => {
        if (!newScreening.name) {
            alert('Please enter a screening name');
            return;
        }
        try {
            const response = await fetch('/admin/stock-screening/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newScreening)
            });
            const data = await response.json();
            if (data.success) {
                await fetchScreenings();
                setShowCreateModal(false);
                setNewScreening({
                    name: '',
                    criteria: {
                        min_price: '',
                        max_price: '',
                        min_volume: '',
                        min_market_cap: '',
                        pe_ratio_max: '',
                        sectors: []
                    }
                });
                alert('Screening created successfully!');
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Failed to create screening:', error);
            alert('Failed to create screening');
        }
    };

    const viewScreeningResults = (screening) => {
        setSelectedScreening(screening);
    };

    return (
        <div>
            <div className="row mb-4">
                <div className="col">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h4>Stock Screening</h4>
                            <p className="text-muted">Create and manage stock screening workflows</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
                            <i className="fas fa-plus me-2"></i>New Screening
                        </button>
                    </div>
                </div>
            </div>

            {/* Screenings List */}
            <div className="row">
                <div className="col-lg-8">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">Stock Screenings</h5>
                        </div>
                        <div className="card-body">
                            {screenings.length === 0 ? (
                                <div className="text-center py-4">
                                    <i className="fas fa-search fa-3x text-muted mb-3"></i>
                                    <p className="text-muted">No stock screenings found. Create one to get started.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Results</th>
                                                <th>Created</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {screenings.map(screening => (
                                                <tr key={screening.id}>
                                                    <td>
                                                        <div className="fw-bold">{screening.name}</div>
                                                        <small className="text-muted">
                                                            {screening.criteria_data?.sectors?.length || 0} sectors
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <span className="badge bg-primary">
                                                            {screening.results_data?.stocks?.length || 0} stocks
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <small>{new Date(screening.created_at).toLocaleDateString()}</small>
                                                    </td>
                                                    <td>
                                                        <div className="btn-group">
                                                            <button className="btn btn-sm btn-outline-primary" onClick={() => viewScreeningResults(screening)}>
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Screening Results */}
                <div className="col-lg-4">
                    <div className="card">
                        <div className="card-header">
                            <h5 className="card-title mb-0">
                                {selectedScreening ? `${selectedScreening.name} Results` : 'Screening Results'}
                            </h5>
                        </div>
                        <div className="card-body">
                            {selectedScreening ? (
                                <ChartVision />
                            ) : (
                                <div className="text-center py-4">
                                    <i className="fas fa-chart-bar fa-2x text-muted mb-3"></i>
                                    <p className="text-muted">Select a screening to view results</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Screening Modal */}
            {showCreateModal && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create New Stock Screening</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Screening Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newScreening.name}
                                        onChange={(e) => setNewScreening({ ...newScreening, name: e.target.value })}
                                        placeholder="e.g., High Volume Tech Stocks"
                                    />
                                </div>
                                <h6>Screening Criteria</h6>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Min Price ($)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={newScreening.criteria.min_price}
                                            onChange={(e) => setNewScreening({
                                                ...newScreening,
                                                criteria: { ...newScreening.criteria, min_price: e.target.value }
                                            })}
                                        />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Max Price ($)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            value={newScreening.criteria.max_price}
                                            onChange={(e) => setNewScreening({
                                                ...newScreening,
                                                criteria: { ...newScreening.criteria, max_price: e.target.value }
                                            })}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Min Volume</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newScreening.criteria.min_volume}
                                        onChange={(e) => setNewScreening({
                                            ...newScreening,
                                            criteria: { ...newScreening.criteria, min_volume: e.target.value }
                                        })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>
                                    Cancel
                                </button>
                                <button type="button" className="btn btn-primary" onClick={createScreening}>
                                    Create Screening
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showCreateModal && <div className="modal-backdrop fade show"></div>}
        </div>
    );
};


export default StockScreening;
