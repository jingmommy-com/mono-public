#

- site_id: (netlify) > (choose project) > Project configuration > General > Project details > `Project ID`

- (netlify)
  - (choose project) > Project configuration
    - Identify
      - Enable Identity
      - Registration > Configure
        - Invite Only
      - Invitation template
        - Configure
          - Path to template: `packages/netlify/invitation.html`
      - Confirmation template
        - Configure
          - Path to template: `packages/netlify/confirmation.html`
      - Recovery template
        - Configure
          - Path to template: `packages/netlify/password_recovery.html`
      - Email change template
        - Configure
          - Path to template: `packages/netlify/email_change.html`
    - Services
      - Enable Git Gateway