import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    zoomPlugin
);

function getSectorChartData(sector) {
    const months = ['Sep 2024', 'Nov 2024', 'Jan 2025', 'Mar 2025', 'May 2025', 'Jul 2025'];
    const baseValue = Math.random() * 100 + 50;
    const data = months.map((month, index) => baseValue + (Math.random() - 0.5) * 20 + index * 2);
    const movingAvg = data.map((d, i, arr) => {
        if (i === 0) return d;
        return (arr[i - 1] + d) / 2;
    });
    return {
        labels: months,
        data,
        movingAvg,
    };
}

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            mode: 'index',
            intersect: false,
        },
        zoom: {
            pan: {
                enabled: true,
                mode: 'xy',
                speed: 0.5,
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: 'xy',
                sensitivity: 0.1,
                speed: 0.1,
            },
            limits: {
                y: { min: 0, max: 500 },
                x: { min: 0, max: 12 },
            },
        },
    },
    scales: {
        x: {
            display: true,
            grid: {
                display: false,
            },
            ticks: {
                font: {
                    size: 10,
                },
            },
        },
        y: {
            display: true,
            grid: {
                color: 'rgba(0,0,0,0.1)',
            },
            ticks: {
                font: {
                    size: 10,
                },
            },
        },
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
    },
};

const UserDashboard = () => {
    const [entryZoneStocks, setEntryZoneStocks] = useState([]);
    const [breakoutStocks, setBreakoutStocks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStocks() {
            try {
                const entryRes = await fetch('/api/stocks/entry-zone');
                const entryData = await entryRes.json();
                setEntryZoneStocks(entryData.stocks || []);
                const breakoutRes = await fetch('/api/stocks/breakout');
                const breakoutData = await breakoutRes.json();
                setBreakoutStocks(breakoutData.stocks || []);
            } catch (err) {
                // handle error
            }
            setLoading(false);
        }
        fetchStocks();
    }, []);

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    const techSector = getSectorChartData('Technology');
    const techChartData = {
        labels: techSector.labels,
        datasets: [
            {
                label: 'Price',
                data: techSector.data,
                borderColor: 'blue',
                borderWidth: 2,
                fill: false,
            },
            {
                label: 'Moving Avg',
                data: techSector.movingAvg,
                borderColor: 'red',
                borderWidth: 2,
                borderDash: [8, 4],
                fill: false,
            },
        ],
    };

    const renderBullishReason = (reason) => {
        if (!reason) return <span className="text-muted">-</span>;
        const strongSignals = ["Breakout", "Entry Zone", "Strong Volume", "Golden Cross", "High Momentum"];
        const isStrong = strongSignals.some(sig => reason.toLowerCase().includes(sig.toLowerCase()));
        const color = isStrong ? "#198754" : "#0d6efd";
        const badge = isStrong ? <span className="badge bg-success ms-2">Strong</span> : null;
        const shortText = reason.length > 30 ? reason.slice(0, 30) + "..." : reason;
        return (
            <span style={{ color, fontWeight: isStrong ? "bold" : "normal" }} title={reason}>
                {shortText} {badge}
            </span>
        );
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">User Dashboard</h2>
            <div className="row">
                <div className="col-md-8 mx-auto">
                    <div className="card shadow-sm mb-4">
                        <div className="card-body">
                            <h5 className="card-title">Technology Sector Chart</h5>
                            <div style={{ height: '300px' }}>
                                <Line data={techChartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">Entry Zone Stocks</div>
                        <div className="card-body">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Name</th>
                                        <th>Sector</th>
                                        <th>Price</th>
                                        <th>Bullish Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {entryZoneStocks.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center text-muted">No records</td></tr>
                                    ) : (
                                        entryZoneStocks.map((stock, idx) => (
                                            <tr key={stock.symbol || idx}>
                                                <td>{stock.symbol}</td>
                                                <td>{stock.name}</td>
                                                <td>{stock.sector}</td>
                                                <td>{stock.price}</td>
                                                <td>{renderBullishReason(stock.bullish_reason)}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card mb-4">
                        <div className="card-header">Breakout Stocks</div>
                        <div className="card-body">
                            <table className="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Symbol</th>
                                        <th>Name</th>
                                        <th>Sector</th>
                                        <th>Price</th>
                                        <th>Bullish Reason</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {breakoutStocks.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center text-muted">No records</td></tr>
                                    ) : (
                                        breakoutStocks.map((stock, idx) => (
                                            <tr key={stock.symbol || idx}>
                                                <td>{stock.symbol}</td>
                                                <td>{stock.name}</td>
                                                <td>{stock.sector}</td>
                                                <td>{stock.price}</td>
                                                <td>{renderBullishReason(stock.bullish_reason)}</td>
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
};

export default UserDashboard;
