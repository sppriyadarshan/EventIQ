"""Add theme, theme_id, and food_details to events table

Revision ID: 002_add_event_theme_food
Revises: 001_initial_schema
Create Date: 2026-09-28

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '002_add_event_theme_food'
down_revision: Union[str, None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('events', sa.Column('theme', sa.String(length=255), nullable=True))
    op.add_column('events', sa.Column('theme_id', sa.String(length=100), nullable=True))
    op.add_column('events', sa.Column('food_details', sa.String(length=255), nullable=True))


def downgrade() -> None:
    op.drop_column('events', 'food_details')
    op.drop_column('events', 'theme_id')
    op.drop_column('events', 'theme')
