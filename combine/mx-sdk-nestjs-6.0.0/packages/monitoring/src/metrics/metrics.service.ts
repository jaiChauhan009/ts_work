import { Injectable } from "@nestjs/common";
import { register, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';
import { ElasticMetricType } from "./entities/elastic.metric.type";

@Injectable()
export class MetricsService {
  private static apiCpuTimeHistogram: Histogram<string>;
  private static apiCallsHistogram: Histogram<string>;
  private static apiConcurrentRequestsHistogram: Histogram<string>;
  private static pendingRequestsHistogram: Gauge<string>;
  private static externalCallsHistogram: Histogram<string>;
  private static rabbitConsumerDurationHistogram: Histogram<string>;
  private static rabbitConsumerCpuHistogram: Histogram<string>;
  private static elasticDurationHistogram: Histogram<string>;
  private static redisDurationHistogram: Histogram<string>;
  private static redisCommonDurationHistogram: Histogram<string>;
  private static jobsHistogram: Histogram<string>;
  private static pendingApiHitGauge: Gauge<string>;
  private static cachedApiHitGauge: Gauge<string>;
  private static guestHitsGauge: Gauge<string>;
  private static guestNoCacheHitsGauge: Gauge<string>;
  private static guestHitQueriesGauge: Gauge<string>;
  private static consumerHistogram: Histogram<string>;
  private static clusterComparisonGauge: Gauge<string>;
  private static queuePublishGauge: Gauge<string>;
  private static queueConsumeGauge: Gauge<string>;
  private static duplicateQueueMessagesDetected: Gauge<string>;
  private static redlockAcquireDurationHistogram: Histogram<string>;
  private static redlockProcessDurationHistogram: Histogram<string>;
  private static redlockFailureGauge: Gauge<string>;
  private static isDefaultMetricsRegistered: boolean = false;

  constructor() {
    if (!MetricsService.apiCpuTimeHistogram) {
      MetricsService.apiCpuTimeHistogram = new Histogram({
        name: 'api_cpu_time',
        help: 'API CPU time',
        labelNames: ['endpoint'],
        buckets: [],
      });
    }

    if (!MetricsService.apiCallsHistogram) {
      MetricsService.apiCallsHistogram = new Histogram({
        name: 'api',
        help: 'API Calls',
        labelNames: ['endpoint', 'origin', 'code'],
        buckets: [],
      });
    }

    if (!MetricsService.apiConcurrentRequestsHistogram) {
      MetricsService.apiConcurrentRequestsHistogram = new Histogram({
        name: 'api_concurrent_requests',
        help: 'API Concurrent Requests',
        labelNames: ['endpoint'],
        buckets: [],
      });
    }

    if (!MetricsService.clusterComparisonGauge) {
      MetricsService.clusterComparisonGauge = new Gauge({
        name: 'cluster_data',
        help: 'Cluster comparison data',
        labelNames: ['name'],
      });
    }

    if (!MetricsService.pendingRequestsHistogram) {
      MetricsService.pendingRequestsHistogram = new Gauge({
        name: 'pending_requests',
        help: 'Pending requests',
        labelNames: ['endpoint'],
      });
    }

    if (!MetricsService.externalCallsHistogram) {
      MetricsService.externalCallsHistogram = new Histogram({
        name: 'external_apis',
        help: 'External Calls',
        labelNames: ['system'],
        buckets: [],
      });
    }

    if (!MetricsService.elasticDurationHistogram) {
      MetricsService.elasticDurationHistogram = new Histogram({
        name: 'elastic_duration',
        help: 'Elastic Duration',
        labelNames: ['type', 'index'],
        buckets: [],
      });
    }

    if (!MetricsService.redisDurationHistogram) {
      MetricsService.redisDurationHistogram = new Histogram({
        name: 'redis_duration',
        help: 'Redis Duration',
        labelNames: ['action'],
        buckets: [],
      });
    }

    if (!MetricsService.redisCommonDurationHistogram) {
      MetricsService.redisCommonDurationHistogram = new Histogram({
        name: 'redis_common_duration',
        help: 'Redis Common Duration',
        labelNames: ['action'],
        buckets: [],
      });
    }

    if (!MetricsService.jobsHistogram) {
      MetricsService.jobsHistogram = new Histogram({
        name: 'jobs',
        help: 'Jobs',
        labelNames: ['job_identifier', 'result'],
        buckets: [],
      });
    }

    if (!MetricsService.pendingApiHitGauge) {
      MetricsService.pendingApiHitGauge = new Gauge({
        name: 'pending_api_hits',
        help: 'Number of hits for pending API calls',
        labelNames: ['endpoint'],
      });
    }

    if (!MetricsService.cachedApiHitGauge) {
      MetricsService.cachedApiHitGauge = new Gauge({
        name: 'cached_api_hits',
        help: 'Number of hits for cached API calls',
        labelNames: ['endpoint'],
      });
    }

    if (!MetricsService.guestNoCacheHitsGauge) {
      MetricsService.guestNoCacheHitsGauge = new Gauge({
        name: 'guest_no_cache_hits',
        help: 'Request no-cache hits for guest users',
        labelNames: [],
      });
    }

    if (!MetricsService.guestHitsGauge) {
      MetricsService.guestHitsGauge = new Gauge({
        name: 'guest_hits',
        help: 'Request hits for guest users',
        labelNames: [],
      });
    }

    if (!MetricsService.guestHitQueriesGauge) {
      MetricsService.guestHitQueriesGauge = new Gauge({
        name: 'guest_hit_queries',
        help: 'Distinct queries for guest hit caching',
        labelNames: [],
      });
    }

    if (!MetricsService.consumerHistogram) {
      MetricsService.consumerHistogram = new Histogram({
        name: 'consumer',
        help: 'Consumer jobs',
        labelNames: ['consumer'],
        buckets: [],
      });
    }

    if (!MetricsService.queuePublishGauge) {
      MetricsService.queuePublishGauge = new Gauge({
        name: 'queue_publish',
        help: 'Messages published to queue',
        labelNames: ['queue', 'source'],
      });
    }

    if (!MetricsService.queueConsumeGauge) {
      MetricsService.queueConsumeGauge = new Gauge({
        name: 'queue_consume',
        help: 'Messages consumed from queue',
        labelNames: ['queue', 'handler'],
      });
    }

    if (!MetricsService.duplicateQueueMessagesDetected) {
      MetricsService.duplicateQueueMessagesDetected = new Gauge({
        name: 'queue_duplicated_messages',
        help: 'Duplicated messages detected in queue',
        labelNames: ['queue', 'source'],
      });
    }

    if (!MetricsService.rabbitConsumerDurationHistogram) {
      MetricsService.rabbitConsumerDurationHistogram = new Histogram({
        name: 'rabbit_consumer_duration',
        help: 'Rabbit consumer duration',
        labelNames: ['queue', 'handler'],
        buckets: [],
      });
    }

    if (!MetricsService.rabbitConsumerCpuHistogram) {
      MetricsService.rabbitConsumerCpuHistogram = new Histogram({
        name: 'rabbit_consumer_cpu',
        help: 'Rabbit consumer cpu',
        labelNames: ['queue', 'handler'],
        buckets: [],
      });
    }

    if (!MetricsService.redlockAcquireDurationHistogram) {
      MetricsService.redlockAcquireDurationHistogram = new Histogram({
        name: 'redlock_acquire_duration',
        help: 'Redlock acquire duration',
        labelNames: ['type'],
        buckets: [],
      });
    }

    if (!MetricsService.redlockProcessDurationHistogram) {
      MetricsService.redlockProcessDurationHistogram = new Histogram({
        name: 'redlock_process_duration',
        help: 'Redlock process duration',
        labelNames: ['type'],
        buckets: [],
      });
    }

    if (!MetricsService.redlockFailureGauge) {
      MetricsService.redlockFailureGauge = new Gauge({
        name: 'redlock_failures',
        help: 'Redlock failures',
        labelNames: ['type', 'failure'],
      });
    }

    if (!MetricsService.isDefaultMetricsRegistered) {
      MetricsService.isDefaultMetricsRegistered = true;
      collectDefaultMetrics();
    }
  }

  setApiCpuTime(endpoint: string, duration: number) {
    MetricsService.apiCpuTimeHistogram.labels(endpoint).observe(duration);
  }

  setApiCall(endpoint: string, origin: string, status: number, duration: number) {
    MetricsService.apiCallsHistogram.labels(endpoint, origin, status.toString()).observe(duration);
  }

  setApiConcurrentRequests(endpoint: string, count: number) {
    MetricsService.apiConcurrentRequestsHistogram.labels(endpoint).observe(count);
  }

  setPendingRequestsCount(count: number) {
    MetricsService.pendingRequestsHistogram.set(count);
  }

  setExternalCall(system: string, duration: number) {
    MetricsService.externalCallsHistogram.labels(system).observe(duration);
  }

  setElasticDuration(collection: string, type: ElasticMetricType, duration: number) {
    MetricsService.elasticDurationHistogram.labels(type, collection).observe(duration);
  }

  setRedisDuration(action: string, duration: number) {
    MetricsService.externalCallsHistogram.labels('redis').observe(duration);
    MetricsService.redisDurationHistogram.labels(action).observe(duration);
  }

  static setJobResult(job: string, result: 'success' | 'error', duration: number) {
    MetricsService.jobsHistogram.labels(job, result).observe(duration);
  }

  incrementPendingApiHit(endpoint: string) {
    MetricsService.pendingApiHitGauge.inc({ endpoint });
  }

  incrementCachedApiHit(endpoint: string) {
    MetricsService.cachedApiHitGauge.inc({ endpoint });
  }

  static setQueuePublish(queue: string, source?: string) {
    MetricsService.queuePublishGauge.inc({
      queue,
      source,
    });
  }

  static setQueueConsume(queue: string, handler?: string) {
    MetricsService.queueConsumeGauge.inc({
      queue,
      handler,
    });
  }

  static incrementGuestHits() {
    MetricsService.guestHitsGauge.inc();
  }

  static incrementGuestNoCacheHits() {
    MetricsService.guestNoCacheHitsGauge.inc();
  }

  static setGuestHitQueries(count: number) {
    MetricsService.guestHitQueriesGauge.set(count);
  }

  static setQueueHandlerDuration(queue: string, method: string, duration: number) {
    MetricsService.rabbitConsumerDurationHistogram.labels(queue, method).observe(duration);
  }

  static setQueueHandlerCpu(queue: string, method: string, duration: number) {
    MetricsService.rabbitConsumerCpuHistogram.labels(queue, method).observe(duration);
  }

  static setDuplicatedMessageDetected(queue: string, source?: string) {
    MetricsService.duplicateQueueMessagesDetected.inc({ queue, source });
  }

  static setRedisCommonDuration(action: string, duration: number) {
    MetricsService.redisCommonDurationHistogram.labels(action).observe(duration);
  }

  static setClusterComparisonValue(tag: string, value: number) {
    MetricsService.clusterComparisonGauge.labels(tag).set(value);
  }

  setConsumer(consumer: string, duration: number): void {
    MetricsService.consumerHistogram.labels(consumer).observe(duration);
  }

  setRedlockAcquireDuration(type: string, duration: number): void {
    MetricsService.redlockAcquireDurationHistogram.labels(type).observe(duration);
  }

  setRedlockProcessDuration(type: string, duration: number): void {
    MetricsService.redlockProcessDurationHistogram.labels(type).observe(duration);
  }

  incrementRedlockFailure(type: string, failure: string): void {
    MetricsService.redlockFailureGauge.labels(type, failure).inc();
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
