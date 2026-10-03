export function Icon({ name, size = 20, ...props }) {
  const paths = {
    game: <><path d="M7 7h10l3 10a2 2 0 0 1-3 2l-3-3h-4l-3 3a2 2 0 0 1-3-2Z" /><path d="M7 10v4m-2-2h4m7-1h.01m2 3h.01" /></>,
    arrow: <><path d="m9 5 7 7-7 7M4 12h12" /></>,
    database: <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" /></>,
    chart: <><path d="M4 4v16h17M8 15v-4m5 4V7m5 8v-6" /></>,
    alert: <><path d="m12 3 10 18H2Z" /><path d="M12 9v5m0 3h.01" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 3 5" /></>,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5ZM20 2v4m-2-2h4" /></>,
    check: <path d="m5 12 4 4L19 6" />,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name] || paths.game}</svg>;
}

export const slides = [
  { title: '프로젝트 소개', short: '프로젝트 소개', label: 'PROJECT OVERVIEW', icon: 'game', month: 'overview', description: '내 라이브러리에서 시작하는 게임 추천' },
  { title: 'Steam 계정 연동 및 데이터 수집', short: '계정 연동 · 데이터 수집', label: 'SEPTEMBER / 01', icon: 'database', month: 'september', description: '실제 사용자 데이터와 학습 데이터를 연결하다' },
  { title: '추천 알고리즘 실험', short: '추천 알고리즘 실험', label: 'SEPTEMBER / 02', icon: 'chart', month: 'september', description: '네 가지 접근을 비교하고 User-KNN을 후보로 선정' },
  { title: '실제 계정 적용 중 발견한 문제', short: '실제 계정 적용 · 문제 발견', label: 'SEPTEMBER / 03', icon: 'alert', month: 'september', description: '오프라인 실험에서 실제 추천으로 넘어가며 발견한 차이' },
  { title: '실제 사용자 검증', short: '실제 사용자 검증', label: 'OCTOBER / 01', icon: 'users', month: 'october', description: '추천이 생성되는 것을 넘어, 취향에 맞는지 확인' },
  { title: 'Content 기반 추천 개선', short: 'Content 기반 추천 개선', label: 'OCTOBER / 02', icon: 'spark', month: 'october', description: '장르와 태그에 플레이 시간을 더해 취향을 표현' },
];

function Card({ icon, title, children, className = '' }) {
  return <div className={`card ${className}`}>
    {icon && <div className="card-icon"><Icon name={icon} /></div>}
    <h3>{title}</h3>{children}
  </div>;
}

function Note({ label, children, tone = '' }) {
  return <div className={`note ${tone}`}><span className="note-label">{label}</span><p>{children}</p></div>;
}

function Cover() {
  return <>
    <div className="cover-grid">
      <div className="cover-copy">
        <div className="eyebrow"><span className="live-dot" /> PERSONAL PROJECT · PROGRESS REPORT</div>
        <h1>다음 게임은,<br /><span>내 취향으로.</span></h1>
        <p className="cover-description">Steam 보유 게임과 플레이 시간을 바탕으로<br className="desktop-break" /> 나에게 맞는 게임을 찾는 개인 추천 서비스.</p>
        <div className="cover-tags"><span>Steam API</span><span>Steam Dataset 2025</span><span>Recommendation</span></div>
        <div className="cover-period"><strong>09 <span>→</span> 10</strong><div>9월 진행상황 & 10월 계획<small>데이터 연결에서 취향 이해까지</small></div></div>
      </div>
      <div className="library-visual" aria-label="보유 게임과 플레이 기록을 연결해 취향을 추천하는 개념도">
        <div className="visual-top"><span><Icon name="game" size={16} /> YOUR LIBRARY</span><span className="tiny-dot" /></div>
        <div className="library-cards" aria-hidden="true">
          <div className="game-art art-one"><div className="orbital" /><span>EXPLORE<br /><b>NEW WORLDS</b></span></div>
          <div className="game-art art-two"><div className="mountains" /><span>FIND YOUR<br /><b>NEXT ADVENTURE</b></span></div>
          <div className="game-art art-three"><div className="rings" /><span>ONE MORE<br /><b>GREAT GAME</b></span></div>
        </div>
        <div className="visual-signal"><span className="signal-line" /><Icon name="spark" size={23} /><span className="signal-line" /></div>
        <div className="recommendation"><div className="recommend-icon"><Icon name="spark" size={26} /></div><div><small>PERSONALIZED DISCOVERY</small><strong>플레이 기록이 취향이 되도록</strong><p>보유 게임 + 플레이 시간 → 개인화 추천</p></div></div>
        <p className="visual-caption">추천 서비스의 흐름을 표현한 개념 이미지</p>
      </div>
    </div>
    <div className="cover-summary"><div><span>01 / INPUT</span><p>Steam 라이브러리</p></div><Icon name="arrow" /><div><span>02 / LEARNING</span><p>추천 알고리즘 비교</p></div><Icon name="arrow" /><div><span>03 / NEXT STEP</span><p>실제 사용자 · 취향 검증</p></div></div>
  </>;
}

function DataSlide() {
  return <>
    <div className="two-columns">
      <Card icon="game" title="실제 계정 데이터"><span className="pill">Steam API</span><ul><li>Steam 계정을 연결해 보유 게임 수집</li><li>게임별 플레이 시간을 추천 입력으로 활용</li><li>보유 게임을 학습 데이터의 게임 목록과 대조</li></ul><div className="card-bottom">개인화의 시작점: 무엇을, 얼마나 플레이했는가</div></Card>
      <Card icon="database" title="추천 실험 데이터"><span className="pill">Steam Dataset 2025</span><ul><li>사용자–게임 상호작용으로 추천 모델 실험</li><li>Positive review를 선호 신호로 사용</li><li>Temporal evaluation으로 시간 순서를 반영</li></ul><div className="card-bottom">과거 상호작용으로 학습하고 이후 데이터로 평가</div></Card>
    </div>
    <div className="flow-strip"><span>계정 연동</span><Icon name="arrow" /><span>게임 · 플레이 시간 수집</span><Icon name="arrow" /><span>데이터셋 매칭</span><Icon name="arrow" /><strong>추천 입력 구성</strong></div>
    <Note label="9월 진행">실제 Steam 라이브러리를 추천 실험과 연결하고, 실제 계정 적용 단계로 진행했습니다.</Note>
  </>;
}

const algorithms = [
  ['Popularity', '전체 사용자에게 인기 있는 게임', '비교 기준', false],
  ['User-KNN', '비슷한 사용자들의 선호 게임', '후보 선정', true],
  ['ALS', '사용자–게임 행렬의 잠재 요인', '비교 실험', false],
  ['BPR', '선호 게임 간의 상대적 순위 학습', '비교 실험', false],
];

function AlgorithmSlide() {
  return <>
    <div className="experiment-toolbar"><span><Icon name="chart" size={18} /> 4개 알고리즘 비교</span><div><span className="pill">Positive review</span><span className="pill">Temporal evaluation</span></div></div>
    <div className="algorithm-table" role="table" aria-label="추천 알고리즘 비교">
      <div className="table-row table-head" role="row"><span role="columnheader">ALGORITHM</span><span role="columnheader">추천 접근</span><span role="columnheader">실험 결과</span></div>
      {algorithms.map(([name, approach, status, selected]) => <div className={`table-row ${selected ? 'selected-row' : ''}`} role="row" key={name}><strong role="cell">{name}</strong><span role="cell">{approach}</span><span role="cell"><span className={`status ${selected ? 'blue' : ''}`}>{selected && <Icon name="check" size={14} />}{status}</span></span></div>)}
    </div>
    <Note label="후보 모델" tone="blue-note"><strong>User-KNN</strong>을 실제 계정 적용을 위한 후보로 선정했습니다. 다음 단계에서 사용자별 추천 품질을 확인합니다.</Note>
    <p className="footnote">비교 범위와 후보 선정 결과를 정리했습니다. 정량 점수와 모델 간 성능 우열은 별도 실험 결과가 필요합니다.</p>
  </>;
}

function ProblemSlide() {
  return <>
    <div className="problem-grid">
      <Card title="01. 데이터 커버리지 문제" icon="alert" className="problem-card">
        <div className="overlap-metric"><strong>0<span>%</span></strong><div>실제 사용자 catalog overlap<small>5-core filtering 적용 시 발견</small></div></div>
        <p>5-core filtering으로 게임 목록이 축소되면서 실제 사용자 보유 게임과의 교집합이 사라졌습니다.</p>
        <div className="resolution"><Icon name="check" size={17} /><span>Filtering 완화 후 실제 추천 생성 가능</span></div>
      </Card>
      <Card title="02. 취향 반영 문제" icon="users" className="problem-card">
        <div className="taste-visual"><span>사용자의 장르 취향</span><div className="broken-connection">··· <Icon name="alert" size={19} /> ···</div><span>추천 게임</span></div>
        <p>친구 계정 테스트에서 추천 게임이 사용자의 장르 취향을 충분히 반영하지 못하는 문제를 발견했습니다.</p>
        <div className="next-action"><Icon name="arrow" size={17} /><span>10월: genre/tag 기반 취향 프로필 개선</span></div>
      </Card>
    </div>
    <Note label="발견한 점">추천 생성 가능 여부와 취향 적합성은 각각 검증해야 합니다. 데이터 커버리지를 확보한 뒤 개인화를 개선할 계획입니다.</Note>
    <p className="footnote">Catalog overlap: 실제 보유 게임과 학습 데이터 게임 목록의 교집합 · 5-core: 사용자와 게임에 최소 5개 상호작용이 남도록 필터링</p>
  </>;
}

function ValidationSlide() {
  return <>
    <div className="validation-grid">
      <div className="steps">
        {[['01', '다양한 계정으로 테스트', '게임 보유 수와 장르 취향이 다른 실제 계정에 추천을 적용합니다.'], ['02', '추천 결과에 대한 피드백', '추천된 게임에 대한 관심도와 장르 취향 일치 여부를 확인합니다.'], ['03', '반복 검증과 개선', '추천이 생성되지 않는 경우와 취향 불일치 사례를 기록해 개선합니다.']].map(([number, title, body]) => <div className="step" key={number}><span className="step-number">{number}</span><div><h3>{title}</h3><p>{body}</p></div></div>)}
      </div>
      <Card title="10월 검증 포인트" icon="users" className="checklist-card"><div className="checklist"><p><Icon name="check" /> 실제 계정에서 추천이 생성되는가</p><p><Icon name="check" /> 보유 게임과 데이터셋이 연결되는가</p><p><Icon name="check" /> 선호하는 장르가 반영되는가</p><p><Icon name="check" /> 플레이해 보고 싶은 추천인가</p></div><div className="card-bottom">친구 계정 테스트를 실제 사용자 검증으로 확장</div></Card>
    </div>
    <Note label="10월 목표" tone="blue-note">오프라인 실험 결과를 실제 사용자 경험과 연결하고, 개선에 활용할 구체적인 피드백을 수집합니다.</Note>
  </>;
}

function ContentSlide() {
  return <>
    <div className="content-pipeline">
      <Card title="게임의 특징" icon="game"><div className="feature-tags"><span>Genre</span><span>Tag</span></div><p>각 게임의 장르와 태그를<br />콘텐츠 특징으로 표현</p></Card>
      <span className="pipeline-arrow"><Icon name="arrow" size={25} /></span>
      <Card title="사용자의 취향" icon="users" className="profile-card"><div className="profile-label">CONTENT PROFILE</div><div className="profile-bars" aria-hidden="true"><i /><i /><i /></div><p>보유 게임의 특징에<br /><strong>플레이 시간 가중치</strong>를 반영</p></Card>
      <span className="pipeline-arrow"><Icon name="arrow" size={25} /></span>
      <Card title="취향에 가까운 추천" icon="spark"><div className="match-icon"><Icon name="spark" size={32} /></div><p>사용자 프로필과 후보 게임의<br />콘텐츠 유사도로 추천</p></Card>
    </div>
    <div className="formula"><span>USER PROFILE</span><p>플레이한 게임의 genre/tag 특징 <b>×</b> 플레이 시간 기반 가중치</p></div>
    <Note label="다음 단계" tone="blue-note">User-KNN 결과와 Content 기반 추천을 실제 사용자 피드백으로 비교해, 장르 취향 반영이 개선되는지 확인합니다.</Note>
    <p className="closing">추천이 나오는 서비스에서, <strong>내 취향을 이해하는 서비스로.</strong></p>
  </>;
}

export const slideComponents = [Cover, DataSlide, AlgorithmSlide, ProblemSlide, ValidationSlide, ContentSlide];
