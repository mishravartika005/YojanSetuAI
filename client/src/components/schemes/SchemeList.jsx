import SchemeCard from './SchemeCard';
import EmptyState from '../common/EmptyState';
import { SearchX } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function SchemeList({ schemes = [] }) {
  const { t } = useLanguage();
  if (!schemes.length) {
    return (
      <EmptyState
        icon={SearchX}
        title={t('noSchemesToDisplay')}
        description={t('noSchemesDesc')}
      />
    );
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {schemes.map((scheme) => (
        <SchemeCard
          key={scheme.id || scheme.title || scheme.name || 'scheme-item'}
          title={scheme.title || scheme.name || 'Scheme information will appear here'}
          department={scheme.department || 'Department information pending'}
          description={scheme.description || 'Details will be available once verified data is connected.'}
          eligibilityScore={scheme.eligibilityScore || 0}
          category={scheme.category || 'General'}
          benefits={scheme.benefits || 'Benefits details will be added later'}
          saved={Boolean(scheme.saved)}
          onSave={scheme.onSave}
          onView={scheme.onView}
        />
      ))}
    </div>
  );
}