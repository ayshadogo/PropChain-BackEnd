import { Injectable } from '@nestjs/common';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';

@Injectable()
export class TracingService {
  private sdk: NodeSDK;

  init() {
    this.sdk = new NodeSDK({
      serviceName: 'propchain-backend',
      instrumentations: [getNodeAutoInstrumentations()],
    });

    this.sdk.start();
  }
}
