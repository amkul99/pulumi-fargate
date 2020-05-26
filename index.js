"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");

// // Create an AWS resource (S3 Bucket)
// const bucket = new aws.s3.Bucket("my-bucket");

// // Export the name of the bucket
// exports.bucketName = bucket.id;

// Create a load balancer on port 80 and spin up two instances of Nginx.
const lb = new awsx.lb.ApplicationListener("nginx", {
    port: 80

});
const nginx = new awsx.ecs.FargateService("nginx", {
    taskDefinitionArgs: {
        containers: {
            nginx: {
                image: "nginx",
                memory: 128,
                portMappings: [lb],
            },
        },
    },
    desiredCount: 2,
});

const httpd_lb = new awsx.lb.ApplicationListener("httpd", {
    port: 80

});
const httpd_c = new awsx.ecs.FargateService("httpd", {
    taskDefinitionArgs: {
        containers: {
            nginx: {
                image: "httpd",
                memory: 128,
                portMappings: [httpd_lb],
            }
        },
    },
    desiredCount: 2,
});


// Export the load balancer's address so that it's easy to access.
// export const url = lb.endpoint.hostname;
exports.url = lb.endpoint.hostname;
exports.httpd_lb_url = httpd_lb.endpoint.hostname;