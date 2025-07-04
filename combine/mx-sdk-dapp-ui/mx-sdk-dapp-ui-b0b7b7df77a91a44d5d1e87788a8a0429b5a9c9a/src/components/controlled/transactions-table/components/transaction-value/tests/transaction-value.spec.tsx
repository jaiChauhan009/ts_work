import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import type { TransactionValueType } from 'components/controlled/transactions-table/transactions-table.type';

import { TransactionValue } from '../transaction-value';

describe('TransactionValue', () => {
  it('renders with minimal props', async () => {
    const value: TransactionValueType = {
      rewaLabel: '',
      link: '',
      linkText: '',
      name: '',
      ticker: '',
      valueDecimal: '',
      valueInteger: '',
    };

    const page = await newSpecPage({
      components: [TransactionValue],
      template: () => <mvx-transaction-value value={value}></mvx-transaction-value>,
    });

    expect(page.root).toEqualHtml(`
      <mvx-transaction-value>
          <div class="transaction-value"></div>
      </mvx-transaction-value>
    `);
  });

  it('renders with badge', async () => {
    const value: TransactionValueType = {
      badge: 'NFT',
      rewaLabel: '',
      link: '',
      linkText: '',
      name: '',
      ticker: '',
      valueDecimal: '',
      valueInteger: '',
    };

    const page = await newSpecPage({
      components: [TransactionValue],
      template: () => <mvx-transaction-value value={value}></mvx-transaction-value>,
    });

    expect(page.root).toEqualHtml(`
      <mvx-transaction-value>
          <div class="transaction-value">
            <div class="badge badge-pill badge-secondary font-weight-light transaction-value-badge" data-testid="transactionNftBadge">
              NFT
            </div>
          </div>
      </mvx-transaction-value>
    `);
  });

  it('renders with formatted amount', async () => {
    const value: TransactionValueType = {
      showFormattedAmount: true,
      rewaLabel: 'xREWA',
      valueDecimal: '123',
      valueInteger: '123',
      link: '',
      linkText: '',
      name: '',
      ticker: '',
    };

    const page = await newSpecPage({
      components: [TransactionValue],
      template: () => <mvx-transaction-value value={value}></mvx-transaction-value>,
    });

    expect(page.root).toEqualHtml(`
      <mvx-transaction-value>
          <div class="transaction-value">
            <mvx-format-amount class="mr-1" datatestid="transactionActionFormattedAmount" isvalid="" label="xREWA" valuedecimal="123" valueinteger="123"></mvx-format-amount>
          </div>
      </mvx-transaction-value>
    `);
  });

  it('renders with explorer link', async () => {
    const value: TransactionValueType = {
      rewaLabel: '',
      link: 'https://example.com',
      linkText: 'Example Link',
      name: 'Example',
      ticker: 'EX',
      valueDecimal: '',
      valueInteger: '',
    };

    const page = await newSpecPage({
      components: [TransactionValue],
      template: () => <mvx-transaction-value value={value}></mvx-transaction-value>,
    });

    expect(page.root).toEqualHtml(`
      <mvx-transaction-value>
          <div class="transaction-value">
            <mvx-explorer-link class="transaction-value-link text-truncate" link="https://example.com">
              <div class="transaction-value-content">
                <span class="transaction-value-link-text">Example Link</span>
              </div>
            </mvx-explorer-link>
          </div>
      </mvx-transaction-value>
    `);
  });

  it('renders with SVG icon', async () => {
    const value: TransactionValueType = {
      rewaLabel: '',
      link: 'https://example.com',
      linkText: 'Example Link',
      svgUrl: 'https://example.com/icon.svg',
      name: 'Example Icon',
      ticker: 'EX',
      valueDecimal: '',
      valueInteger: '',
    };

    const page = await newSpecPage({
      components: [TransactionValue],
      template: () => <mvx-transaction-value value={value}></mvx-transaction-value>,
    });

    expect(page.root).toEqualHtml(`
      <mvx-transaction-value>
          <div class="transaction-value">
            <mvx-explorer-link class="transaction-value-link side-link d-flex" link="https://example.com">
              <div class="transaction-value-content">
                <img alt="Example Icon" class="transaction-value-img" src="https://example.com/icon.svg">
                <span class="transaction-value-link-text">Example Link</span>
              </div>
            </mvx-explorer-link>
          </div>
      </mvx-transaction-value>
    `);
  });

  it('renders with truncated text', async () => {
    const value: TransactionValueType = {
      rewaLabel: '',
      link: 'https://example.com',
      linkText: 'Example Link',
      ticker: 'EXM',
      collection: 'EXM',
      name: 'Example',
      valueDecimal: '',
      valueInteger: '',
    };

    const page = await newSpecPage({
      components: [TransactionValue],
      template: () => <mvx-transaction-value value={value}></mvx-transaction-value>,
    });

    expect(page.root).toEqualHtml(`
      <mvx-transaction-value>
          <div class="transaction-value">
            <mvx-explorer-link class="transaction-value-link text-truncate" link="https://example.com">
              <div class="transaction-value-content">
                <span class="transaction-value-link-text truncate">Example Link</span>
              </div>
            </mvx-explorer-link>
          </div>
      </mvx-transaction-value>
    `);
  });

  it('renders with titleText', async () => {
    const value: TransactionValueType = {
      rewaLabel: '',
      link: 'https://example.com',
      linkText: 'Example Link',
      name: 'Example',
      ticker: 'EX',
      valueDecimal: '',
      valueInteger: '',
      titleText: 'Title Text',
    };

    const page = await newSpecPage({
      components: [TransactionValue],
      template: () => <mvx-transaction-value value={value}></mvx-transaction-value>,
    });

    expect(page.root).toEqualHtml(`
      <mvx-transaction-value>
          <div class="transaction-value">
            <mvx-explorer-link class="transaction-value-link text-truncate" link="https://example.com">
              <div class="transaction-value-content">
                <span class="transaction-value-link-text">Example Link</span>
              </div>
            </mvx-explorer-link>
            <mvx-fa-icon class="transaction-value-icon" title="Title Text"></mvx-fa-icon>
          </div>
      </mvx-transaction-value>
    `);
  });
});
