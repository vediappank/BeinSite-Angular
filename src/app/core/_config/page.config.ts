export class PageConfig {
	public defaults: any = {
		'dashboard': {
			page: {
				'title': 'Dashboard',
				'desc': 'Latest updates and statistic charts'
			},
			ccratiodashboard: 
			{
				page: {'title': 'Call Center Dashboard',	'desc': 'Call Center Dashboard'}
			},
			cbrdashboard: 
			{
				page: {'title': 'Business Review Dashboard',	'desc': 'Business Review Dashboard'}
			},
			testdashboard: 
			{
				page: {'title': 'Test Dashboard',	'desc': 'Test Dashboard'}
			},
			rtivrdashboard: 
			{
				page:{'title': 'RT IVR Dashboard',	'desc': 'Real Time IVR CSQ and Agent Details'}
			},
			outbounddashboard: 
			{
				page:{'title': 'Outbound Dashboard',	'desc': 'Outbound Dashboard Details'}
			}
		},
		// 'rt-dashboard': {
		// 	page: {
		// 		'title': 'RealTime Dashboard',
		// 		'desc': 'RealTime Dashboard Informations'
		// 	},
		// 	rtivrdashboard: 
		// 	{
		// 		page:{'title': 'RT IVR Dashboard',	'desc': 'Real Time IVR CSQ and Agent Details'}
		// 	}
		// },
		'meeting': {
			page: {
				'title': 'Schedule Meeting Information',
				'desc': 'Schedule Meeting Information'
			},
			'schedulemeeting': 
			{
				page:{'title': 'Schedule Meetting',	'desc': 'New Meeting Schedule Information'}
			}
		},
		'flashreports': {			
			floorperformancereport: 
			{			 
			 page:{'title': 'Rabat Site Performance',	'desc': 'Rabat Site Performance Details'}
			},
			callactivityreport: 
			{			 
			 page:{'title': 'Flash Reports',	'desc': 'Flash Reports Details'}
			},
			agentstatisticsreport: 
			{			 
			 page:{'title': 'Agent Statistics Report',	'desc': 'Agent Statistics Report Details'}
			},
			supervisorsummaryreport: 
			{			 
			 page:{'title': 'Supervisor Summary Report',	'desc': 'Supervisor Summary Report Details'}
			},
			whatsappcallactivityreport: 
			{			 
			 page:{'title': 'Whatsapp Call Activity Report',	'desc': 'Whatsapp Call Activity Report Details'}
			}			,
			agentperformance: 
			{			 
			 page:{'title': 'Agent Activity Report',	'desc': 'Agent Activity Report Details'}
			},
			myperformance: 
			{			 
			 page:{'title': 'My Activity Report',	'desc': 'My Activity Report Details'}
			}
		},
		'forecast': {			
			agentforecast: 
			{
				page: {'title': 'Agent ForeCasting',	'desc': 'Agent ForeCasting'}
			}
		},		
		'operations': {			
			reskillingskillgroups: {
				page: {title: 'ReSkilling By Skill Groups', desc: 'ReSkilling By Skill Groups'}
			},
			reskillingskillgroupsbyagent: {
				page: {title: 'ReSkilling By Agent', desc: 'ReSkilling By Agent'}
			},			
			campaignupload: {
				page: {title: 'Campaign-Contact Upload / Remove', desc: 'Campaign-Contact Upload / Remove'}
			},
			campaignjobs: {
				page: {title: 'Campagin Upload Job Report', desc: 'Campagin Upload Job Details'}
			},
			salescallbacks: 
			{
				page: {'title': 'Sales Callbacks',	'desc': 'Sales Callbacks'}
			},
			escalationtickets: 
			{
				page: {'title': 'Escalation Tickets',	'desc': 'Escalation Tickets'}
			}
		},			
		'user-management': {
			users: {
				page: {title: 'Users', desc: 'Users Informations'}
			},
			roles: {
				page: {title: 'Roles', desc: 'Roles Informations'}
			},
			ccroles: {
				page: {title: 'Designation', desc: 'Designation Informations'}
			},
			ccactivity: {
				page: {title: 'Activity', desc: 'Activity Informations'}
			},
			userprofile: {
				page: {title: 'Profile Settings', desc: 'Profile Settings Informations'}
			},
			cckpilist: {
				page: {title: 'Call Center KPI List', desc: 'Call Center KPI Informations'}
			},
			rolepermission: {
				page: {title: 'Role Permission', desc: 'Role Permission Informations'}
			}			
		
		},
		'reports': {
			reports: {
				page: {title: 'Reports', desc: ''}
			},
			reportslist: {
				page: {title: 'Reports List', desc: 'All Reports Informations'}
			},
			agentratioreport: {
				page: {title: 'Agent Ratio Report', desc: 'Agent Ratio Report Informations'}
			},
			agentactivityreport: {
				page: {title: 'Agent Activity Report', desc: 'Agent Activity Report Informations'}
			},
			agenthirringreport: {
				page: {title: 'Agent Hirring Report', desc: 'Agent Hirring Report  Informations'}
			},
			agentattritionreport: {
				page: {title: 'Agent Attrition Report', desc: 'Agent Attrition Report Informations'}
			},
			callmetricsreport: {
				page: {title: 'Call Metrics Report', desc: 'Call Metrics Report Informations'}
			},
			manualoutboundreport: {
				page: {title: 'Agent Manual Outbound Report', desc: 'Agent Manual Outbound Report Informations'}
			},
			whatsupreport: {
				page: {title: 'WhatsApp Report', desc: 'WhatsApp Report Informations'}
			},
			absentiesreport: {
				page: {title: 'Absenties Report', desc: 'Absenties Report Informations'}
			},
			financereport: {
				page: {title: 'Finance Report', desc: 'Finance Report Informations'}
			},
			ticketlogaccuracyreport:{
				page: {title: 'Ticket Log Accuracy Report', desc: 'Ticket Log Accuracy Report Informations'}
			},			
			agentinforeport:{
				page: {title: 'Agent Performance Report', desc: 'Agent Performance Report Informations'}
            },			
			supervisorinforeport: {				
				page: {title: 'Supervisor Performance Report', desc: 'Supervisor Performance Report Informations'}
            },			
			qualityreport: {				
				page: {title: 'Quality Report', desc: 'Quality Report Informations'}
            },
			useractivityreport: {
				page: {title: 'User Activity Report', desc: 'User Activity Information'}
			},
			userccrolereport:{
				page: {title: 'User CCRole Report', desc: 'User CCRole Information'}
			},			
			userorganizationreport:{
				page: {title: 'User Organization Report', desc: 'User Organization Information'}
            },			
			userrolereport: {				
				page: {title: 'User Role Report', desc: 'User Role Information'}
            },			
			usersupervisorreport: {				
				page: {title: 'User Supervisor Report', desc: 'User Supervisor Information'}
            }
		},
		'userprofile': {
			userprofile: {
				page: {title: 'User Profile', desc: 'User Profile'}
			},
			profileoverview: {
				page: {title: 'Profile Overview', desc: 'Profile Overview'}
			},
			ChangePassword: {
				page: {title: 'Change Password', desc: 'Change Password'}
			}			
		},
		'vouchers': {
			vouchercodelist: {
				page: {title: 'Vouchers  List', desc: 'Vocuchers  Informations'}
			},
			uploadvouchers: {
				page: {title: 'Upload Vouchers', desc: 'Vocuchers  Informations'}
			}			
		
		},
		builder: {
			page: {title: 'Layout Builder', desc: ''}
		},
		header: {
			actions: {
				page: {title: 'Actions', desc: 'Actions example page'}
			}
		},
		profile: {
			page: {title: 'User Profile', desc: 'User Profile Infomation'}
		},
		error: {
			404: {
				page: {title: '404 Not Found', desc: '', subheader: false}
			},
			403: {
				page: {title: '403 Access Forbidden', desc: '', subheader: false}
			}
		},
		wizard: {
			'wizard-1': {page: {title: 'Wizard 1', desc: ''}},
			'wizard-2': {page: {title: 'Wizard 2', desc: ''}},
			'wizard-3': {page: {title: 'Wizard 3', desc: ''}},
			'wizard-4': {page: {title: 'Wizard 4', desc: ''}},
		},
	};

	public get configs(): any {
		return this.defaults;
	}
}
