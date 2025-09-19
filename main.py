from app import app, db
import models

def add_sample_stocks():
    User = models.User
    Watchlist = models.Watchlist
    admin = User.query.filter_by(email='admin@tradinggrow.com').first()
    if not admin:
        admin = User(email='admin@tradinggrow.com', full_name='Admin User', is_admin=True)
        db.session.add(admin)
        db.session.commit()

    # Entry Zone
    entry_watchlist = Watchlist.query.filter_by(user_id=admin.id, watchlist_type='entry').first()
    if not entry_watchlist:
        entry_watchlist = Watchlist(name="Admin Entry Zone Stocks", user_id=admin.id, watchlist_type='entry')
        db.session.add(entry_watchlist)
        db.session.commit()
    if not any(stock.get('symbol') == 'NFLX' for stock in entry_watchlist.stocks):
        entry_watchlist.add_stock({'symbol': 'NFLX', 'name': 'Netflix Inc.', 'sector': 'Technology', 'price': 400.00, 'change_percent': 2.5})
        db.session.commit()

    # Breakout
    breakout_watchlist = Watchlist.query.filter_by(user_id=admin.id, watchlist_type='breakout').first()
    if not breakout_watchlist:
        breakout_watchlist = Watchlist(name="Admin Breakout Stocks", user_id=admin.id, watchlist_type='breakout')
        db.session.add(breakout_watchlist)
        db.session.commit()
    if not any(stock.get('symbol') == 'NVDA' for stock in breakout_watchlist.stocks):
        breakout_watchlist.add_stock({'symbol': 'NVDA', 'name': 'NVIDIA Corp.', 'sector': 'Technology', 'price': 700.00, 'change_percent': 5.0})
        db.session.commit()

if __name__ == '__main__':
    with app.app_context():
        add_sample_stocks()
    app.run(host='0.0.0.0', port=5000, debug=True)
