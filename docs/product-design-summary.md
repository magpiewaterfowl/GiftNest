# GiftNest Product Design Summary

## Theme Direction

Thoughtful, familiar, and welcoming throughout the year. GiftNest is a place to understand the people you love, not a storefront or a holiday shopping campaign. Family-and-friend photography, an understated gift mark, and everyday gift imagery carry that story.

## Color and Type

| Choice                                    | Purpose                                                     |
| ----------------------------------------- | ----------------------------------------------------------- |
| Evergreen `#254f43`, deep green `#183d33` | Trustworthy text, navigation, and primary actions           |
| Clay `#b85640`, soft peach `#f0a68e`      | Warm accents and the landing page's primary invitation      |
| Cool white `#fafcfc`                      | A light, quiet background without a beige or seasonal theme |
| Muted green `#586e62`, borders `#dde7e2`  | Readable secondary text and gentle organization             |
| Peach, blue, sage, and lilac accents      | A little variety for people, interests, and occasions       |

Lora gives key headings a personal, editorial voice. DM Sans keeps forms, navigation, and longer copy clear. Type sizes are fixed and responsive by breakpoint, not scaled with viewport width. Small labels, touch targets, field text, and reading space are larger than the baseline.

## Major Decisions

- Tell a people-first story: know loved ones better, ease last-minute gifting pressure, and use hints while leaving room for a personal surprise. Do not imply that private reservations or surprise-protection features exist.
- Keep commands clear and familiar. Use gift-oriented language for wishes, plain-language notes for browser-only limitations, and actionable empty states.
- Preserve the existing questionnaire and scoring exactly. Improve progress presentation, answer spacing, conversational reassurance, and results readability without changing categories, answer mappings, or saved data.
- Use restrained borders, consistent buttons, aligned member cards, larger wishlist tools, and distinct Lucide icons for all twenty categories. No new product controls or purchasing workflow were added.
- Retain visible focus, native dialogs and radio controls, reduced-motion support, semantic navigation, and accessible contrast. Dialogs now restore focus to their opening control when it remains on the page. Received wishes expose their existing toggle state to assistive technology.

## Screens Improved

Landing and sign-up/login; family dashboard and no-group states; own and family-member profiles; populated and empty wishlists; profile/wish/group/help dialogs; all ten questionnaire steps; populated and empty results; signed-out and not-found screens. Repository-subpath navigation and static GitHub Pages export remain unchanged.

## Remaining Opportunities

- Test comprehension, navigation, and form wording with older family members and assistive-technology users; automated checks do not replace that feedback.
- Consider personally selected, licensed imagery and self-hosted fonts/photos in a separate asset/privacy pass. Current external assets still require internet access.
- Consolidate the historical CSS cascade in a dedicated maintenance task after the visual direction is approved.
- Design real privacy and surprise-preserving states only alongside a future backend and authentication. Browser-local accounts are still a prototype, not a secure shared family service.

The design-only pass introduced no backend, authentication provider, AI integration, reservations, or hidden suggestions. The later [gift-suggestion feature](gift-suggestions.md) adds a browser-local recommendation simulation with separately documented privacy limits. No commit is created automatically.
