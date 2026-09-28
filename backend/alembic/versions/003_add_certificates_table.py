"""Add certificates table

Revision ID: 003_add_certificates_table
Revises: 002_add_event_theme_food
Create Date: 2026-09-28

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '003_add_certificates_table'
down_revision: Union[str, None] = '002_add_event_theme_food'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'certificates',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('certificate_id', sa.String(length=100), nullable=False),
        sa.Column('registration_id', sa.Integer(), nullable=False),
        sa.Column('event_id', sa.Integer(), nullable=False),
        sa.Column('student_name', sa.String(length=255), nullable=False),
        sa.Column('event_name', sa.String(length=255), nullable=False),
        sa.Column('institution_name', sa.String(length=255), nullable=False),
        sa.Column('event_date', sa.String(length=100), nullable=True),
        sa.Column('venue_name', sa.String(length=255), nullable=True),
        sa.Column('registration_id_display', sa.String(length=100), nullable=True),
        sa.Column('organizer_name', sa.String(length=255), nullable=True),
        sa.Column('issued_at', sa.DateTime(), nullable=True),
        sa.Column('verification_token', sa.String(length=255), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['event_id'], ['events.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['registration_id'], ['event_registrations.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('certificate_id'),
        sa.UniqueConstraint('registration_id'),
        sa.UniqueConstraint('verification_token')
    )
    op.create_index(op.f('ix_certificates_certificate_id'), 'certificates', ['certificate_id'], unique=True)
    op.create_index(op.f('ix_certificates_registration_id'), 'certificates', ['registration_id'], unique=True)
    op.create_index(op.f('ix_certificates_verification_token'), 'certificates', ['verification_token'], unique=True)


def downgrade() -> None:
    op.drop_index(op.f('ix_certificates_verification_token'), table_name='certificates')
    op.drop_index(op.f('ix_certificates_registration_id'), table_name='certificates')
    op.drop_index(op.f('ix_certificates_certificate_id'), table_name='certificates')
    op.drop_table('certificates')
