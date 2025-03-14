from setuptools import setup, find_packages

setup(
    name="mindset_analyzer",
    version="1.0.0",
    packages=find_packages(),
    install_requires=[
        "Flask==3.0.2",
        "Werkzeug==3.0.1",
        "SQLAlchemy==2.0.27",
        "alembic==1.13.1",
        "pandas==2.2.1",
        "numpy==1.26.4",
        "scikit-learn==1.3.2",
        "tensorflow==2.15.0",
        "plotly==5.19.0",
        "dash==2.14.2",
        "requests==2.31.0",
        "python-dotenv==1.0.1",
    ],
    python_requires=">=3.9",
) 