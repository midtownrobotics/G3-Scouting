import { useState, useEffect } from 'react';
import { DataStatsResponse } from '@shared/schemas/data';
import { fetchAPIJSON } from '../../../API';
import FormIdInput from '../helpers/FormIdInput';
import { getTeamSummaryUrl } from '../helpers/utils';

export default function DataStats() {
    const [statsData, setStatsData] = useState<DataStatsResponse>();
    const [loading, setLoading] = useState(false);
    const [formId, setFormId] = useState<string>();

    useEffect(() => {
        if (!formId) return;

        setLoading(true);
        fetchAPIJSON(`/data/getDataStats/${formId}`, DataStatsResponse)
            .then(res => {
                if (res) setStatsData(res);
            })
            .finally(() => setLoading(false));
    }, [formId]);

    if (loading) {
        return (
            <div className="p-3">
                <h1 className="mb-4">Data Statistics</h1>
                <FormIdInput onChange={setFormId} />
                <div className="text-muted">Loading statistics... This can take a minute.</div>
            </div>
        );
    }

    if (!formId) {
        return (
            <div className="p-3">
                <h1 className="mb-4">Data Statistics</h1>
                <FormIdInput onChange={setFormId} />
                <div className="text-muted mt-3">Please select a form to view statistics</div>
            </div>
        );
    }

    if (!statsData) {
        return (
            <div className="p-3">
                <h1 className="mb-4">Data Statistics</h1>
                <FormIdInput onChange={setFormId} />
                <div className="text-danger mt-3">Failed to load statistics</div>
            </div>
        );
    }

    return (
        <div className="p-3">
            <h1 className="mb-4">Data Statistics</h1>
            <FormIdInput onChange={setFormId} />

            <div className="container-fluid mt-4">
                {/* Summary Cards */}
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <div className="card border-primary border-2 shadow-sm">
                            <div className="card-body">
                                <h6 className="card-subtitle mb-2 text-muted">Total Coverage</h6>
                                <h2 className="card-title text-primary mb-1">
                                    {statsData.totalCoverage.toFixed(1)}%
                                </h2>
                                <p className="card-text text-muted small mb-0">
                                    Overall match scouting coverage
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card border-success border-2 shadow-sm">
                            <div className="card-body">
                                <h6 className="card-subtitle mb-2 text-muted">Average Error</h6>
                                <h2 className="card-title text-success mb-1">
                                    {statsData.averageError.toFixed(1)}%
                                </h2>
                                <p className="card-text text-muted small mb-0">
                                    Mean accuracy score deviation
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team Coverage Table */}
                <div className="card shadow-sm">
                    <div className="card-header bg-light">
                        <h5 className="mb-0">Team Coverage</h5>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive">
                            <table className="table table-hover mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col">Team</th>
                                        <th scope="col" className="text-end">Scouted</th>
                                        <th scope="col" className="text-end">Total</th>
                                        <th scope="col" className="text-end">Coverage</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {statsData.teamCoverage.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted py-5">
                                                No team data available
                                            </td>
                                        </tr>
                                    ) : (
                                        statsData.teamCoverage.map((team) => (
                                            <tr key={team.team}>
                                                <td className="fw-semibold">
                                                    <a href={getTeamSummaryUrl(parseInt(team.team))} className="text-decoration-none">
                                                        Team {team.team}
                                                    </a>
                                                </td>
                                                <td className="text-end text-muted">{team.matchesScouted}</td>
                                                <td className="text-end text-muted">{team.totalMatches}</td>
                                                <td className="text-end">
                                                    <span 
                                                        className={`badge ${
                                                            team.percentage >= 80 ? 'bg-success' :
                                                            team.percentage >= 50 ? 'bg-warning text-dark' :
                                                            'bg-danger'
                                                        }`}
                                                    >
                                                        {team.percentage.toFixed(1)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}