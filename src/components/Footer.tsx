import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
    return (
        <footer className="relative z-10 border-t border-purple-900/50 pt-12 pb-8 px-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm">© 2026 AWS Cloud Club Univali. Todos os direitos reservados.</p>
            <div className="flex gap-6">
                <a href="https://github.com/awscloudclubunivali" target='_blank' aria-label="GitHub" className="text-gray-400 hover:text-white transition-colors">
                    <FontAwesomeIcon icon={faGithub} size="xl" />
                </a>
                <a href="https://www.linkedin.com/company/aws-cloud-club-univali" target='_blank' aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                    <FontAwesomeIcon icon={faLinkedin} size="xl" />
                </a>
            </div>
            </div>
        </footer>
    );
          
};

export default Footer;