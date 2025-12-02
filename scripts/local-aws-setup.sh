#!/bin/bash

# Set AWS environment variables for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_SESSION_TOKEN=test
export AWS_DEFAULT_REGION=us-east-1

echo "Setting AWS environment variables for LocalStack"
echo "AWS_ACCESS_KEY_ID=test"
echo "AWS_SECRET_ACCESS_KEY=test"
echo "AWS_SESSION_TOKEN=test"
echo "AWS_DEFAULT_REGION=us-east-1"

# Wait for LocalStack S3 to be ready
echo "Waiting for LocalStack S3..."
until aws --endpoint-url=http://localhost:4566 s3 ls; do
  sleep 1
done
echo "LocalStack S3 Ready"

# Create S3 bucket
echo "Creating LocalStack S3 bucket: fragments"
aws --endpoint-url=http://localhost:4566 s3 mb s3://fragments

# Create DynamoDB table
echo "Creating DynamoDB-Local DynamoDB table: fragments"
aws --endpoint-url=http://localhost:8000 dynamodb create-table \
    --table-name fragments \
    --attribute-definitions \
        AttributeName=ownerId,AttributeType=S \
        AttributeName=id,AttributeType=S \
    --key-schema \
        AttributeName=ownerId,KeyType=HASH \
        AttributeName=id,KeyType=RANGE \
    --provisioned-throughput \
        ReadCapacityUnits=10,WriteCapacityUnits=5

echo "Local AWS setup complete!"
