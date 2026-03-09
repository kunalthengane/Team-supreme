"""
Database helper for Postgres using psycopg2.

Reads connection information from environment variables:
 - DATABASE_URL (preferred) or individual vars: PG_HOST, PG_PORT, PG_DB, PG_USER, PG_PASSWORD

Provides `insert_complaint(...)` used by the Flask app.
"""
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager


def _get_conn_params():
    database_url = os.environ.get('DATABASE_URL')
    if database_url:
        return {'dsn': database_url}

    host = os.environ.get('PG_HOST', 'localhost')
    port = os.environ.get('PG_PORT', '5432')
    db = os.environ.get('PG_DB', 'postgres')
    user = os.environ.get('PG_USER', 'postgres')
    password = os.environ.get('PG_PASSWORD', '')
    dsn = f"postgresql://{user}:{password}@{host}:{port}/{db}"
    return {'dsn': dsn}


@contextmanager
def get_conn():
    params = _get_conn_params()
    conn = psycopg2.connect(params['dsn'])
    try:
        yield conn
    finally:
        conn.close()


def insert_complaint(title: str, description: str, category: str = 'other', severity: str = 'low',
                     submitted_by: str = None, sentiment_score: float = 0.0, sentiment_label: str = 'Neutral', priority: str = 'normal'):
    """Insert a complaint record and return the inserted row as a dict.

    This uses the `complaints` table from the project's schema.
    """
    insert_sql = """
    INSERT INTO complaints (title, description, category, severity, submitted_by, sentiment_score, sentiment_label, priority)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING *;
    """

    with get_conn() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute(insert_sql, (title, description, category, severity, submitted_by, sentiment_score, sentiment_label, priority))
            row = cur.fetchone()
            conn.commit()
            return dict(row) if row else None


def close():
    # placeholder if we later add pooling
    return
